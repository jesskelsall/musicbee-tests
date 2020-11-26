import { Test } from "../..";
import { ValueValidation } from "../../../test";

export const test = new Test("Initialise or read value validation lists", async () => {
  const valueValidation = ValueValidation.Instance;
  await valueValidation.populate();
});
