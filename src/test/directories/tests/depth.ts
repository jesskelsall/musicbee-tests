import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory } from "../../../fs";

const maxDepth = 2;

export function test(directory: MusicDirectory): Test {
  return new Test(`Is no deeper than ${maxDepth} directories`, async () => {
    expect(directory.path.depth, "Directory depth").to.be.lte(maxDepth);
  });
}
