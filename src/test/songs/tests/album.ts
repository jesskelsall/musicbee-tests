import { Test, ValueValidation } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

export function test(song: MusicFile): Test {
  return new Test("Tag: album", async () => {
    const album = testTagExists(song, "album");

    const valueValidation = ValueValidation.Instance;
    await valueValidation.validateAlbum(album);
  });
}
