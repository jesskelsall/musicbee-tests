import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile } from "../../../fs";

export function test(song: MusicFile): Test {
  return new Test("Has an m4a extension", async () => {
    const baseNameParts = song.path.baseName.split(".");

    expectWithMessage("song file name", "Song path", "have an extension", () => {
      expect(baseNameParts).to.be.of.length.greaterThan(1);
    });

    const extension = baseNameParts[baseNameParts.length - 1];
    expect(extension, "Song file name, extension").to.equal("m4a");
  });
}
