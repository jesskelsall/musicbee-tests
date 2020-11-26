import { TestSuite } from "..";
import { testContent, testCWD, testFFProbe, testValueValidation } from "./tests";

export async function runTests(): Promise<boolean> {
  const testSuite = TestSuite.Instance;
  testSuite.setContext("Preliminary");

  await testSuite.run(testFFProbe);
  await testSuite.run(testValueValidation);
  const cwdResult = await testSuite.run(testCWD);
  await testSuite.run(testContent, cwdResult.failed());

  return testSuite.contextPassing();
}
