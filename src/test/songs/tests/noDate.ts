import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile } from "../../../fs";

export function test(song: MusicFile): Test {
  return new Test("No tag: date", async () => {
    expectWithMessage("song tags", "Song tags", "not have property 'date'", () => {
      expect(song.format.tags).to.not.have.property("date");
    }, true);
  });
}
