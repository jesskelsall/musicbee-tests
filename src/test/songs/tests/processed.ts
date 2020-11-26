import { expect } from "chai";

import { Test } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

export function test(song: MusicFile): Test {
  return new Test("Custom tag: processed", async () => {
    const processed = testTagExists(song, "LOCATION");

    expect(processed, "Song processed tag").to.equal("Asana");
  });
}
