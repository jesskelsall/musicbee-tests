import * as fs from "fs";
import * as path from "path";

import { MusicDirectory } from "./MusicDirectory";
import { MusicFile } from "./MusicFile";

export class FoundMusicContent {

  private static instance: FoundMusicContent;

  public content: MusicDirectory;
  private disallowedFiles: string[];

  private constructor() {
    this.disallowedFiles = ["desktop.ini", "thumbs.db"];
  }

  public static get Instance() {
    if (this.instance) { return this.instance; }
    return this.instance = new this();
  }

  public async populate(): Promise<void> {
    if (this.content) {
      throw new Error("FoundMusicContent has already been populated");
    }

    this.content = await this.getDirectoryAndContents(process.cwd());
  }

  private async getDirectoryAndContents(absolutePath: string): Promise<MusicDirectory> {
    const directory = new MusicDirectory(absolutePath);
    const contents = await this.readDirectoryContents(absolutePath);

    for (const content of contents) {
      const contentPath = path.join(absolutePath, content);

      if (await this.isDirectory(contentPath)) {
        directory.contents.push(await this.getDirectoryAndContents(contentPath));
      } else if (this.isAllowedFile(content)) {
        directory.contents.push(new MusicFile(contentPath));
      }
    }

    return directory;
  }

  private isAllowedFile(fileName: string): boolean {
    if (this.disallowedFiles.indexOf(fileName) !== -1) { return false; }
    return !fileName.startsWith(".");
  }

  private isDirectory(absolutePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(absolutePath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
        err ? reject(err) : resolve(stats.isDirectory());
      });
    });
  }

  private readDirectoryContents(absolutePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(absolutePath, (err: NodeJS.ErrnoException, files: string[]) => {
        err ? reject(err) : resolve(files);
      });
    });
  }

}
