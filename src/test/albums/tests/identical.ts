import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicDirectory, MusicFile } from "../../../fs";

type IdenticalTag = "album" | "album artist" | "compilation" | "date";

const tagNames = {
  "album": "album",
  "album artist": "album_artist",
  "compilation": "FILETYPE",
  "date": "date",
};

export function test(album: MusicDirectory, tagName: IdenticalTag): Test {
  const tag = tagNames[tagName];

  return new Test(`Identical tags: ${tagName} tag`, async () => {
    const songs = album.contents.filter((content) => content instanceof MusicFile) as MusicFile[];
    const tagValues = songs.map((song) => song.format.tags[tag]);
    const uniqueTagValues = [...new Set(tagValues)];

    expectWithMessage(`song ${tagName} tags`, "Album song tags", "all be identical", () => {
      expect(uniqueTagValues).to.be.of.length(1);
    }, true);
  });
}
