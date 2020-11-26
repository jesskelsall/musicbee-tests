import { expect } from "chai";

import { Test } from "../..";
import { MusicDirectory, MusicFile } from "../../../fs";
import { directorySanitize } from "../../../utilities";

export function test(directory: MusicDirectory): Test {
  return new Test("Is in a correctly named album artist directory", async () => {
    const albumArtistDirectory = directory.path.parts[0];
    const firstSong = directory.contents[0] as MusicFile;
    const windowsAlbumArtist = directorySanitize(firstSong.format.tags.album_artist as string);

    expect(albumArtistDirectory).to.equal(windowsAlbumArtist);
  });
}
