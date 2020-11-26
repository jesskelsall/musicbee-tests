import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory } from "../../../fs";

export function test(directory: MusicDirectory): Test {
  return new Test("Contains directories", async () => {
    expect(directory.contents, "Directory contents").to.not.be.empty;

    for (const content of directory.contents) {
      expect(content, "Directory content").to.be.an.instanceOf(MusicDirectory);
    }
  });
}
