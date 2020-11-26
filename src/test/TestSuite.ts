import { magenta } from "chalk";

import { Test } from "./Test";
import { TestResult, TestResultType } from "./TestResult";
import { testSuiteFormat, TestSuiteFormat } from "./TestSuiteFormat";

interface FailedTest {
  context: Context;
  result: TestResult;
}

interface ResultCount {
  fail: number;
  pass: number;
  skip: number;
}

type ContextPart = string;
type Context = ContextPart[];

export class TestSuite {

  private static instance: TestSuite;

  private context: Context;
  private failedTests: FailedTest[];
  private format: TestSuiteFormat;
  private resultCount: ResultCount;

  private constructor() {
    this.context = [];
    this.failedTests = [];
    this.format = testSuiteFormat;
    this.resultCount = { fail: 0, pass: 0, skip: 0 };
  }

  public static get Instance(): TestSuite {
    if (this.instance) { return this.instance; }
    return this.instance = new this();
  }

  public contextFailing(): boolean {
    return !this.contextPassing();
  }

  public contextPassing(): boolean {
    const failedTestsThisContext = this.failedTests.filter((fail) => {
      return fail.context.length === this.context.length &&
        fail.context.every((contextPart, index) => contextPart === this.context[index]);
    });

    return !failedTestsThisContext.length;
  }

  public finish(): boolean {
    this.log();
    this.logStat("pass");
    this.logStat("skip");
    this.logStat("fail");
    this.log();
    this.logFails();

    return this.resultCount.fail + this.resultCount.skip === 0;
  }

  public getInquirerPrefix(): string {
    return this.formatIndentForContext(magenta("?"), 1);
  }

  public async run(test: Test, skip: boolean = false): Promise<TestResult> {
    if (skip) {
      return this.skip(test) as TestResult;
    }

    let testError: Error | undefined;

    try {
      await test.test();
    } catch (err) {
      testError = err;
    }

    const resultType = testError ? "fail" : "pass";
    const result = new TestResult(test.name, resultType, testError);

    if (testError) {
      this.failedTests.push({
        context: this.context.slice(),
        result,
      });
    }

    this.logResult(result);
    this.resultCount[resultType]++;
    return result;
  }

  public setContext(...context: Context): void {
    if (!context.length) {
      throw new Error("TestSuite context cannot be empty");
    }

    const divergentContext: Context = context.slice();

    for (const position in this.context) {
      if (this.context[position] === context[position]) {
        divergentContext.shift();
      } else {
        this.removeContextParts(this.context.length - Number(position));
        break;
      }
    }

    for (const contextPart of divergentContext) {
      this.addContextPart(contextPart);
    }
  }

  public skip(test?: Test): TestResult | void {
    this.resultCount.skip++;

    if (test) {
      const result = new TestResult(test.name, "skip");
      this.logResult(result);
      return result;
    } else {
      this.logContextSkip();
    }
  }

  private addContextPart(contextPart: ContextPart): void {
    this.context.push(contextPart);
    this.logContext();
  }

  private formatIndent(text: string, steps: number): string {
    const indentation = " ".repeat(this.format.indent * steps);
    return `${indentation}${text}`;
  }

  private formatIndentForContext(text: string, addedSteps: number = 0): string {
    const steps = this.context.length + addedSteps;
    return this.formatIndent(text, steps);
  }

  private getLastContextPart(): ContextPart {
    return this.context[this.context.length - 1];
  }

  private log(text: string = ""): void {
    console.info(text); // tslint:disable-line:no-console
  }

  private logContext(): void {
    const contextPart = this.getLastContextPart();
    const context = this.formatIndentForContext(contextPart);

    this.log();
    this.log(context);
  }

  private logContextSkip(): void {
    const skipFormat = this.format.result.skip;
    const skipText = skipFormat.resultColour("Skipped tests in this context");
    const skip = this.formatIndentForContext(skipText, 1);

    this.log(skip);
  }

  private logFails(): void {
    this.failedTests.forEach((failedTest, index) => {
      const failNumber = `${index + 1})`;
      const failName = failedTest.context.concat(failedTest.result.name).join(": ");
      const fail = this.formatIndent(`${failNumber} ${failName}`, 1);

      const error = failedTest.result.error as Error;
      let errorMessage = "Unspecified error";

      if (error.message) {
        errorMessage = `${error.name}: ${error.message}`;
      } else if (error.stack) {
        errorMessage = error.stack.split("\n")[0].trim();
      }

      const failError = this.formatIndent(this.format.result.fail.colour(errorMessage), 3);

      this.log(fail);
      this.log(failError);
      this.log();
    });
  }

  private logResult(testResult: TestResult): void {
    const resultFormat = this.format.result[testResult.result];
    const resultName = resultFormat.resultColour(testResult.name);
    const resultMark = resultFormat.markColour(
      testResult.result === "fail" ? `${this.failedTests.length})` : resultFormat.mark,
    );
    const result = this.formatIndentForContext(`${resultMark} ${resultName}`, 1);

    this.log(result);
  }

  private logStat(statType: TestResultType): void {
    const count = this.resultCount[statType];
    const pastTenseResultType = {
      fail: "failed",
      pass: "passed",
      skip: "skipped",
    };

    if (statType === "pass" || count) {
      const statFormat = this.format.result[statType];
      const stat = this.formatIndent(statFormat.colour(`${count} ${pastTenseResultType[statType]}`), 1);

      this.log(stat);
    }
  }

  private removeContextParts(quantity: number = 1): void {
    this.context.splice(quantity * -1);
  }

}
