import { expect } from "chai";

import { expectWithMessage, Test, ValueValidation } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

const message = "Song title tag";

export function test(song: MusicFile): Test {

  return new Test("Tag: title", async () => {
    const title = testTagExists(song, "title");

    expectWithMessage(title, message, "not be featuring an artist", () => {
      expect(title).to.not.match(/\bfeat(\.|uring)*\b/i);
    });

    for (const bracket of ["[", "]", "{", "}"]) {
      expect(title, message).to.not.include(bracket);
    }

    const openingBrackets = (title.match(/\(/g) || []).length;
    const closingBrackets = (title.match(/\)/g) || []).length;

    expectWithMessage(title, message, "have the same number of opening and closing brackets", () => {
      expect(openingBrackets).to.equal(closingBrackets);
    });

    const valueValidation = ValueValidation.Instance;
    await valueValidation.validateTitle(title);
  });
}
