import { Test, ValueValidation } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

export function test(song: MusicFile): Test {
  return new Test("Tag: genre", async () => {
    const genre = testTagExists(song, "genre");

    const valueValidation = ValueValidation.Instance;
    await valueValidation.validateGenre(genre);
  });
}
