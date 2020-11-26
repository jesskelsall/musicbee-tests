import { TestSuite } from "..";
import { FoundMusicContent, MusicDirectory, MusicFile } from "../../fs";
import { testAlbum, testAlbumArtist, testDepth, testDiscTrack, testExtension, testTitle } from "./tests";

const testSuite = TestSuite.Instance;

export async function runTests(run: boolean): Promise<boolean> {
  testSuite.setContext("Paths");

  if (!run) {
    testSuite.skip();
    return false;
  }

  const foundMusicContent = FoundMusicContent.Instance;
  return await runContentTestsRecursively(foundMusicContent.content);
}

async function runContentTestsRecursively(directory: MusicDirectory): Promise<boolean> {
  const results: boolean[] = [];

  if (directory.contents[0] instanceof MusicFile) {
    results.push(await runTestsOnDirectory(directory));

    for (const song of directory.contents) {
      results.push(await runTestsOnSong(song as MusicFile));
    }
  } else {
    for (const subDirectory of directory.contents) {
      results.push(await runContentTestsRecursively(subDirectory as MusicDirectory));
    }
  }

  return results.indexOf(false) === -1;
}

async function runTestsOnDirectory(directory: MusicDirectory): Promise<boolean> {
  testSuite.setContext("Paths", ...directory.path.parts);

  if (!directory.isWithinCompilations()) {
    const depthResult = await testSuite.run(testDepth(directory));
    await testSuite.run(testAlbumArtist(directory), depthResult.failed());
  }

  await testSuite.run(testAlbum(directory));

  return testSuite.contextPassing();
}

async function runTestsOnSong(song: MusicFile): Promise<boolean> {
  testSuite.setContext("Paths", ...song.path.parts);

  await testSuite.run(testExtension(song));
  const discTrackResult = await testSuite.run(testDiscTrack(song));
  await testSuite.run(testTitle(song), discTrackResult.failed());

  return testSuite.contextPassing();
}
