import { expect } from "chai";

import { expectWithMessage, Test } from "../..";
import { MusicFile, PositionTag } from "../../../fs";
import { testTagExists } from "../../tests";

export function test(song: MusicFile, tag: PositionTag): Test {
  const message = `Song ${tag} tag`;

  return new Test(`Tag: ${tag}`, async () => {
    const tagValue = testTagExists(song, tag);

    expectWithMessage(tagValue, message, "have a position and a total (X/Y)", () => {
      expect(tagValue).to.include("/");
      expect(tagValue.split("/")).to.be.of.length(2);
    });

    const tagParts = tagValue.split("/");
    const [position, total] = tagParts.map((part) => parseInt(part, 10));

    expectWithMessage(tagValue, message, "have position and total numbers", () => {
      [position, total].forEach((tagPart, index) => {
        expect(tagPart).to.not.be.NaN;
        expect(tagPart).to.be.greaterThan(0);
        expect(tagPart.toString()).to.equal(tagParts[index]);
      });
    });

    expectWithMessage(tagValue, message, "not have a position higher than the total", () => {
      expect(position).to.be.lte(total);
    });

    song.format.positions[tag] = { position, total };
  });
}
