import { expect } from "chai";
import * as pluralize from "pluralize";

import { expectWithMessage, Test } from "../..";
import { MusicDirectory, MusicFile, Position } from "../../../fs";
import { groupSongsByDisc, mapPosition, sortNumeric } from "../../../utilities";

export function test(album: MusicDirectory): Test {
  return new Test("Track tag: Correct total", async () => {
    const discs = groupSongsByDisc(album);

    discs.forEach((tracks, disc) => {
      const trackTotal = tracks
        .map(mapPosition("track"))
        .sort(sortNumeric)
        .reverse()[0];

      const trackPlural = pluralize("track", trackTotal);

      tracks.forEach((song: MusicFile) => {
        const track = song.format.positions.track as Position;
        const subject = `disc ${disc + 1} track ${track.position}`;

        expectWithMessage(subject, "Song track tag", `be of ${trackTotal} ${trackPlural}`, () => {
          expect(track.total).to.equal(trackTotal);
        }, true);
      });
    });
  });
}
