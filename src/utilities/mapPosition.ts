import { MusicFile, Position, PositionTag } from "../fs";

export function mapPosition(tag: PositionTag): (song: MusicFile) => number {
  return (song: MusicFile) => {
    return (song.format.positions[tag] as Position).position;
  };
}
