import { Test } from "../..";
import { FoundMusicContent } from "../../../fs";

export const test = new Test("Current working directory content can be read", async () => {
  const foundMusicContent = FoundMusicContent.Instance;
  await foundMusicContent.populate();
});
