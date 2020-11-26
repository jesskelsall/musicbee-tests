import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory, MusicFile } from "../../../fs";
import { directorySanitize } from "../../../utilities";

export function test(directory: MusicDirectory): Test {
  return new Test("Is in a correctly named album directory", async () => {
    const albumDirectory = directory.path.parts[directory.path.parts.length - 1];
    const firstSong = directory.contents[0] as MusicFile;
    const windowsAlbum = directorySanitize(firstSong.format.tags.album as string);

    expect(albumDirectory).to.equal(windowsAlbum);
  });
}
