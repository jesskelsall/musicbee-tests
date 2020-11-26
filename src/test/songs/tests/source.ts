import { Test, ValueValidation } from "../..";
import { MusicFile } from "../../../fs";
import { testTagExists } from "../../tests";

export function test(song: MusicFile): Test {
  return new Test("Custom tag: source", async () => {
    const source = testTagExists(song, "FILEOWNER");

    const valueValidation = ValueValidation.Instance;
    await valueValidation.validateSource(source);
  });
}
