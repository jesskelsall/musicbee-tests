import { MusicDirectory, MusicFile, Position } from "../fs";

type MusicDiscs = MusicFile[][];

export function groupSongsByDisc(album: MusicDirectory): MusicDiscs {
  return album.contents.reduce((discs: MusicDiscs, song: MusicFile) => {
    const disc = (song.format.positions.disc as Position).position - 1;

    if (!discs[disc]) { discs[disc] = []; }
    discs[disc].push(song);

    return discs;
  }, []);
}
