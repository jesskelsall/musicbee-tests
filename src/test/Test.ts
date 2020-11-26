type TestExecution = () => Promise<void>;

export class Test {

  public name: string;
  public test: TestExecution;

  public constructor(name: string, test: TestExecution) {
    this.name = name;
    this.test = test;
  }

}
