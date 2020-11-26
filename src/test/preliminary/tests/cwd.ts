import { Test } from "../..";
import { MusicPath } from "../../../fs";

export const test = new Test("Current working directory is within a music library", async () => {
  MusicPath.setMusicDirectory();
});
