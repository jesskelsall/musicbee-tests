import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory } from "../../../fs";

export function test(directory: MusicDirectory): Test {
  return new Test("Is exactly 2 directories deep", async () => {
    expect(directory.path.depth).to.equal(2);
  });
}
