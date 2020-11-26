import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile, Position } from "../../../fs";

export const matchDiscTrack = /^(\d{1,})-(\d{2,}) /;

export function test(song: MusicFile): Test {
  return new Test("Has a disc and track position prefix", async () => {
    const discTrackMatch = song.path.baseName.match(matchDiscTrack);

    expectWithMessage("song file name", "Song path", "be prefixed with disc and track position", () => {
      expect(discTrackMatch).to.not.be.null;
    }, true);

    const [, pathDisc, pathTrack] = (discTrackMatch as RegExpMatchArray).map((match) => +match);
    const disc = (song.format.positions.disc as Position).position;
    const track = (song.format.positions.track as Position).position;

    expect(pathDisc, "Song file name, disc").to.equal(disc);
    expect(pathTrack, "Song file name, track").to.equal(track);
  });
}
