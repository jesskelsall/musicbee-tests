export type TestResultType = "fail" | "skip" | "pass";

export class TestResult {

  public error: Error | undefined;
  public name: string;
  public result: TestResultType;

  public constructor(name: string, result: TestResultType, error?: Error) {
    if (result === "fail" && !error) {
      throw new Error("The result of a failed test must contain an error");
    }

    this.error = error;
    this.name = name;
    this.result = result;
  }

  public failed(): boolean {
    return this.result !== "pass";
  }

}
