type ExpectExecution = () => void;

export function expectWithMessage(
  subject: string, context: string, expectation: string, test: ExpectExecution, abstract: boolean = false,
): void {
  try {
    test();
  } catch (err) {
    const subjectText = abstract ? subject : JSON.stringify(subject);
    err.message = `${context}: expected ${subjectText} to ${expectation}`;
    throw err;
  }
}
