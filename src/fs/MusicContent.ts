import { MusicPath } from "./MusicPath";

export class MusicContent {

  public name = "MusicContent";
  public path: MusicPath;

  public constructor(absolutePath: string) {
    this.path = new MusicPath(absolutePath);
  }

}
