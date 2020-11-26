import { TestSuite } from "..";
import { FoundMusicContent, MusicDirectory, MusicFile } from "../../fs";
import { testDiscSequential, testDiscTotal, testIdentical, testTrackSequential, testTrackTotal } from "./tests";

const testSuite = TestSuite.Instance;

export async function runTests(run: boolean): Promise<boolean> {
  testSuite.setContext("Albums");

  if (!run) {
    testSuite.skip();
    return false;
  }

  const foundMusicContent = FoundMusicContent.Instance;
  return await runAlbumTestsRecursively(foundMusicContent.content);
}

async function runAlbumTestsRecursively(directory: MusicDirectory): Promise<boolean> {
  let albumsPassing = true;

  for (const content of directory.contents) {
    if (content instanceof MusicFile) {
      const result = await runTestsOnAlbum(directory);
      if (!result) { albumsPassing = false; }
      break;
    } else {
      const result = await runAlbumTestsRecursively(content);
      if (!result) { albumsPassing = false; }
    }
  }

  return albumsPassing;
}

async function runTestsOnAlbum(album: MusicDirectory): Promise<boolean> {
  testSuite.setContext("Albums", ...album.path.parts);

  await testSuite.run(testIdentical(album, "album"));
  await testSuite.run(testIdentical(album, "album artist"));
  await testSuite.run(testIdentical(album, "date"));
  await testSuite.run(testIdentical(album, "compilation"));

  const discSequentialResult = await testSuite.run(testDiscSequential(album));
  const discTotalResult = await testSuite.run(testDiscTotal(album), discSequentialResult.failed());
  const trackSequentialResult = await testSuite.run(testTrackSequential(album), discTotalResult.failed());
  await testSuite.run(testTrackTotal(album), trackSequentialResult.failed());

  return testSuite.contextPassing();
}
