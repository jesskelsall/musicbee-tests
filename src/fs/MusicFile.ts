import { exec } from "child_process";

import { MusicContent } from "./MusicContent";
import { MusicFormat } from "./MusicFormat";

export class MusicFile extends MusicContent {

  public format: MusicFormat;
  public name = "MusicFile";

  public async probe(): Promise<void> {
    const probedJson = await this.ffprobe();
    const probedData = JSON.parse(probedJson);

    if ("format" in probedData) {
      if ("tags" in probedData.format) {
        this.format = probedData.format;
        this.format.positions = {};
      } else {
        throw new Error("ffprobe returned no tags data");
      }
    } else {
      throw new Error("ffprobe returned no format data");
    }
  }

  private ffprobe(): Promise<string> {
    const command = `ffprobe -v quiet -print_format json -show_format "${this.path.absolute}"`;

    return new Promise((resolve, reject) => {
      exec(command, (err: Error | null, stdout: string, stderr: string) => {
        err || stderr ? reject(err || stderr) : resolve(stdout);
      });
    });
  }

}
