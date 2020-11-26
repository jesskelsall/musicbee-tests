import { TestSuite } from "..";
import { FoundMusicContent, MusicDirectory, MusicFile } from "../../fs";
import {
  testAlbum, testArtist, testCompilation, testDate, testFormat, testGenre, testNoDate, testNoOthers, testPosition,
  testProcessed, testSource, testTitle,
} from "./tests";

const testSuite = TestSuite.Instance;

export async function runTests(run: boolean): Promise<boolean> {
  testSuite.setContext("Songs");

  if (!run) {
    testSuite.skip();
    return false;
  }

  const foundMusicContent = FoundMusicContent.Instance;
  return await runSongTestsRecursively(foundMusicContent.content);
}

async function runSongTestsRecursively(directory: MusicDirectory): Promise<boolean> {
  let songsPassing = true;

  for (const content of directory.contents) {
    let result: boolean;

    if (content instanceof MusicFile) {
      result = await runTestsOnSong(content, directory);
    } else {
      result = await runSongTestsRecursively(content);
    }

    if (!result) { songsPassing = false; }
  }

  return songsPassing;
}

async function runTestsOnSong(song: MusicFile, directory: MusicDirectory): Promise<boolean> {
  testSuite.setContext("Songs", ...song.path.parts);

  const formatResult = await testSuite.run(testFormat(song));
  const skipTagTests = formatResult.failed();

  await testSuite.run(testTitle(song), skipTagTests);
  await testSuite.run(testArtist(song, "artist"), skipTagTests);
  await testSuite.run(testAlbum(song), skipTagTests);
  await testSuite.run(testArtist(song, "album_artist"), skipTagTests);
  await testSuite.run(testGenre(song), skipTagTests);
  await testSuite.run(testPosition(song, "track"), skipTagTests);
  await testSuite.run(testPosition(song, "disc"), skipTagTests);

  if (directory.isACompilation() && directory.path.baseName.startsWith("Big Book")) {
    await testSuite.run(testNoDate(song), skipTagTests);
  } else {
    await testSuite.run(testDate(song), skipTagTests);
  }

  await testSuite.run(testSource(song), skipTagTests);
  await testSuite.run(testCompilation(song), skipTagTests);
  await testSuite.run(testProcessed(song), skipTagTests);

  await testSuite.run(testNoOthers(song), testSuite.contextFailing());

  return testSuite.contextPassing();
}
