import { TestSuite } from "..";
import { FoundMusicContent, MusicDirectory } from "../../fs";
import { testContents, testContentsDirectories, testDepth } from "./tests";

const testSuite = TestSuite.Instance;

export async function runTests(run: boolean): Promise<boolean> {
  testSuite.setContext("Directories");

  if (!run) {
    testSuite.skip();
    return false;
  }

  const foundMusicContent = FoundMusicContent.Instance;
  return await runDirectoryTestsRecursively(foundMusicContent.content);
}

async function runDirectoryTestsRecursively(directory: MusicDirectory): Promise<boolean> {
  let directoriesPassing = await runTestsOnDirectory(directory);

  for (const content of directory.contents) {
    if (content instanceof MusicDirectory) {
      const directoryResult = await runDirectoryTestsRecursively(content);
      if (!directoryResult) { directoriesPassing = false; }
    }
  }

  return directoriesPassing;
}

async function runTestsOnDirectory(directory: MusicDirectory): Promise<boolean> {
  testSuite.setContext("Directories", directory.path.relative || "Music");

  if (!directory.path.relative || directory.isCompilations()) {
    await testSuite.run(testContentsDirectories(directory));
  } else {
    await testSuite.run(testContents(directory));

    if (!directory.isACompilation()) {
      await testSuite.run(testDepth(directory));
    }
  }

  return testSuite.contextPassing();
}
