import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicDirectory } from "../../../fs";
import { groupSongsByDisc, mapPosition, sortNumeric } from "../../../utilities";

export function test(album: MusicDirectory): Test {
  return new Test("Track tag: Sequential position", async () => {
    const discs = groupSongsByDisc(album);

    discs.forEach((tracks, disc) => {
      const trackPositions = tracks.map(mapPosition("track"));
      const uniqueTrackPositions = [...new Set(trackPositions)].sort(sortNumeric);
      const trackJSON = JSON.stringify(uniqueTrackPositions);

      expectWithMessage(`disc ${disc + 1} track disc tags`, "Song disc tags", `be sequential: ${trackJSON}`, () => {
        expect(uniqueTrackPositions[0]).to.equal(1);
        expect(uniqueTrackPositions).to.be.of.length(uniqueTrackPositions.reverse()[0]);
      }, true);
    });
  });
}
