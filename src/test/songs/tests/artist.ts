import { expect } from "chai";

import { expectWithMessage, Test, ValueValidation } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

type ArtistTag = "artist" | "album_artist";

export function test(song: MusicFile, tag: ArtistTag): Test {
  const valueValidation = ValueValidation.Instance;
  const tagName = tag === "artist" ? "artist" : "album artist";
  const message = `Song ${tagName} tag`;

  return new Test(`Tag: ${tagName}`, async () => {
    const tagValue = testTagExists(song, tag);

    expectWithMessage(tagValue, message, "not have more than 1 '&'", () => {
      const ampersands = (tagValue.match(/&/g) || []).length;
      expect(ampersands).to.be.lte(1);
    });

    for (const artist of tagValue.split(/,\s*/g)) {
      await valueValidation.validateArtist(artist);
    }
  });
}
