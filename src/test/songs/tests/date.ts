import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

const message = "Song date tag";

export function test(song: MusicFile): Test {
  return new Test("Tag: date", async () => {
    const date = testTagExists(song, "date");

    expectWithMessage(date, message, "be an ISO 8601 date without time (YYYY-MM-DD)", () => {
      expect(date).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
}
