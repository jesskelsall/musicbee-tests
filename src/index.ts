import "reflect-metadata";

import { TestSuite } from "./test";
import { runTests as runAlbumTests } from "./test/albums";
import { runTests as runDirectoryTests } from "./test/directories";
import { runTests as runPathTests } from "./test/paths";
import { runTests as runPreliminaryTests } from "./test/preliminary";
import { runTests as runSongTests } from "./test/songs";

async function runAllTests(): Promise<void> {
  const testSuite = TestSuite.Instance;

  const preliminaryPassed = await runPreliminaryTests();
  await runDirectoryTests(preliminaryPassed);
  const songsPassed = await runSongTests(preliminaryPassed);
  const albumsPassed = await runAlbumTests(songsPassed);
  await runPathTests(albumsPassed);

  testSuite.finish();
}

runAllTests();
