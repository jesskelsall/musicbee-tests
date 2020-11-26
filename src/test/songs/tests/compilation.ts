import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

const message = "Song compilation tag";

export function test(song: MusicFile): Test {
  return new Test("Custom tag: Compilation", async () => {
    const compilation = testTagExists(song, "FILETYPE");

    expectWithMessage(compilation, message, "equal 'Album' or 'Compilation'", () => {
      expect(compilation).to.be.oneOf(["Album", "Compilation"]);
    });
  });
}
