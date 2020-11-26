interface BaseTags {
  compatible_brands: string;
  creation_time: string;
  major_brand: string;
  minor_version: string;
}

interface ExpectedTags {
  album?: string;
  album_artist?: string;
  artist?: string;
  compilation?: string;
  date?: string;
  disc?: string;
  FILEOWNER?: string;
  FILETYPE?: string;
  genre?: string;
  LOCATION?: string;
  title?: string;
  track?: string;
  [key: string]: string | undefined;
}

export interface MusicFormat {
  bit_rate: string;
  duration: string;
  filename: string;
  format_long_name: string;
  format_name: string;
  nb_programs: number;
  nb_streams: number;
  positions: {
    disc?: Position;
    track?: Position;
  };
  probe_score: number;
  size: string;
  start_time: string;
  tags: BaseTags & ExpectedTags;
}

export interface Position {
  position: number;
  total: number;
}

export type PositionTag = "disc" | "track";
