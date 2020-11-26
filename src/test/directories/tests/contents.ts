import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory } from "../../../fs";

export function test(directory: MusicDirectory): Test {
  return new Test("Contains directories or files", async () => {
    expect(directory.contents, "Directory contents").to.not.be.empty;

    const contentTypes = directory.contents
      .map((content) => content.name)
      .filter((element, index, array) => {
        return array.indexOf(element) === index;
      });

    expect(contentTypes, "Directory content types").to.be.of.length(1);
  });
}
