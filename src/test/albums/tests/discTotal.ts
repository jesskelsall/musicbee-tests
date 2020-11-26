import { expect } from "chai";
import * as pluralize from "pluralize";

import { expectWithMessage, Test } from "../..";
import { MusicDirectory, MusicFile, Position } from "../../../fs";
import { mapPosition, sortNumeric } from "../../../utilities";

export function test(album: MusicDirectory): Test {
  return new Test("Disc tag: Correct total", async () => {
    const discTotal = album.contents
      .map(mapPosition("disc"))
      .sort(sortNumeric)
      .reverse()[0];

    const discPlural = pluralize("disc", discTotal);

    album.contents.forEach((song: MusicFile) => {
      const disc = song.format.positions.disc as Position;
      const track = song.format.positions.track as Position;
      const subject = `disc ${disc.position} track ${track.position}`;

      expectWithMessage(subject, "Song disc tag", `be of ${discTotal} ${discPlural}`, () => {
        expect(disc.total).to.equal(discTotal);
      }, true);
    });
  });
}
