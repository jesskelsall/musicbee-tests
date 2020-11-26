import * as path from "path";

export class MusicPath {

  public static get MusicDirectory(): string {
    return this.musicDirectory;
  }

  public static setMusicDirectory(): void {
    const directoryParts = process.cwd().split(path.sep);

    if (directoryParts.indexOf("Music") === -1) {
      throw new Error("No 'Music' directory in current working directory path");
    }

    MusicPath.musicDirectory = directoryParts
      .slice(0, directoryParts.lastIndexOf("Music") + 1)
      .join(path.sep);
  }

  private static musicDirectory: string;

  public absolute: string;
  public baseName: string;
  public depth: number;
  public parts: string[];
  public relative: string;

  public constructor(absolutePath: string) {
    this.absolute = path.normalize(absolutePath);
    this.baseName = path.basename(absolutePath);
    this.relative = path.relative(MusicPath.musicDirectory, absolutePath);
    this.parts = this.relative.split(path.sep) as string[];
    this.depth = this.parts.length;
  }

}
