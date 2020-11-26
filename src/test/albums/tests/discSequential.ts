import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicDirectory } from "../../../fs";
import { mapPosition, sortNumeric } from "../../../utilities";

export function test(album: MusicDirectory): Test {
  return new Test("Disc tag: Sequential position", async () => {
    const discPositions = album.contents.map(mapPosition("disc"));
    const uniqueDiscPositions = [...new Set(discPositions)].sort(sortNumeric);
    const discJSON = JSON.stringify(uniqueDiscPositions);

    expectWithMessage("album disc tags", "Album disc tags", `be sequential: ${discJSON}`, () => {
      expect(uniqueDiscPositions[0]).to.equal(1);
      expect(uniqueDiscPositions).to.be.of.length(uniqueDiscPositions.reverse()[0]);
    }, true);
  });
}
