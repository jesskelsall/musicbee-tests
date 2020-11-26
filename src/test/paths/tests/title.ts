import { expect } from "chai";

import { Test } from "../..";
import { MusicFile } from "../../../fs";
import { windowsSanitize } from "../../../utilities";
import { matchDiscTrack } from "./discTrack";

export function test(song: MusicFile): Test {
  return new Test("Has a song title", async () => {
    const pathTitle = song.path.baseName
      .replace(matchDiscTrack, "")
      .split(".")
      .slice(0, -1)
      .join(".");

    const title = song.format.tags.title as string;
    const windowsTitle = windowsSanitize(title);

    expect(pathTitle, "Song file name, title").to.equal(windowsTitle);
  });
}
