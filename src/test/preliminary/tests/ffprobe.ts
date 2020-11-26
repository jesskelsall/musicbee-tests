import { exec } from "child_process";

import { Test } from "../..";

export const test = new Test("ffprobe is installed", () => {
  return new Promise((resolve, reject) => {
    exec("ffprobe -version", (err: Error | null) => {
      err ? reject(err) : resolve();
    });
  });
});
