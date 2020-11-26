import { ChalkChain, cyan, green, red, reset } from "chalk";

interface TestSuiteFormatResult {
  colour: ChalkChain;
  mark: string;
  markColour: ChalkChain;
  resultColour: ChalkChain;
}

export interface TestSuiteFormat {
  indent: number;
  result: {
    fail: TestSuiteFormatResult;
    pass: TestSuiteFormatResult;
    skip: TestSuiteFormatResult;
  };
}

export const testSuiteFormat: TestSuiteFormat = {
  indent: 2,
  result: {
    fail: {
      colour: red,
      mark: "✘",
      markColour: red,
      resultColour: red,
    },
    pass: {
      colour: green,
      mark: "✔",
      markColour: green,
      resultColour: reset,
    },
    skip: {
      colour: cyan,
      mark: "-",
      markColour: cyan,
      resultColour: cyan,
    },
  },
};
