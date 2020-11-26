import { expect } from "chai";

import { expectWithMessage } from "..";
import { MusicFile } from "../../fs";

export function testTagExists(song: MusicFile, tag: string): string {
  expectWithMessage("song tags", "Song tags", `have property '${tag}'`, () => {
    expect(song.format.tags).to.have.property(tag);
  }, true);

  const value = song.format.tags[tag] as string;
  expect(value, `Song ${tag} tag`).to.be.a("string").which.is.not.empty;

  return value;
}
