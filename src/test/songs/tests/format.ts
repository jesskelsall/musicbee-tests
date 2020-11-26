import { expect } from "chai";

import { Test } from "../..";
import { MusicFile } from "../../../fs";

export function test(song: MusicFile): Test {
  return new Test("Is an iTunes formatted M4A media file", async () => {
    await song.probe();

    expect(song.format.format_long_name, "Song format long name").to.equal("QuickTime / MOV");
    expect(song.format.tags.major_brand.trim(), "Song major brand tag").to.equal("M4A");
    expect(song.format.tags.minor_version, "Song minor version tag").to.equal("0");
    expect(song.format.tags.compatible_brands, "Song compatible brands tag").to.equal("M4A mp42isom");
  });
}
