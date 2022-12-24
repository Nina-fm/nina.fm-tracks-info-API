export interface Track {
  title?: string;
  artist?: string;
  position?: number;
}

export interface Source {
  id: string;
  type: string;
  artist: string;
  title: string;
  cover: string;
  coverUrl?: string;
  tracks: Track[];
  text_tracks?: string | null;
}
