import { MusicContent } from "./MusicContent";
import { MusicFile } from "./MusicFile";

export type MusicContentType = MusicDirectory | MusicFile;

export class MusicDirectory extends MusicContent {

  public contents: MusicContentType[] = [];
  public name = "MusicDirectory";

  public isACompilation(): boolean {
    return this.isWithinCompilations() && this.path.depth > 1;
  }

  public isCompilations(): boolean {
    return this.isWithinCompilations() && this.path.depth === 1;
  }

  public isWithinCompilations(): boolean {
    return this.path.parts[0].includes("Compilations");
  }

}
