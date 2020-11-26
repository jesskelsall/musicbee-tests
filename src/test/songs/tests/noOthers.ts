import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile } from "../../../fs";

const allowedTagNames = [
  "album", "album_artist", "artist", "compatible_brands", "compilation", "creation_time", "date", "disc", "FILEOWNER",
  "FILETYPE", "genre", "LOCATION", "major_brand", "minor_version", "title", "track",
];

export function test(song: MusicFile): Test {
  return new Test("No other tags", async () => {
    const tagNames = Object.keys(song.format.tags);
    const disallowedTagNames = tagNames.filter((tag) => allowedTagNames.indexOf(tag) === -1);

    const disallowedList = disallowedTagNames
      .sort()
      .map((tag) => `'${tag}'`)
      .join(", ");

    expectWithMessage("song tags", "Song tags", `not include ${disallowedList}`, () => {
      expect(disallowedTagNames).to.be.empty;
    }, true);
  });
}
