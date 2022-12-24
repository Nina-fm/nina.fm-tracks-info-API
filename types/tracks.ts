export interface TrackItem {
  title?: string;
  artist?: string;
  position?: number;
}

export interface Track {
  id: string;
  type: string;
  artist: string;
  title: string;
  cover: string;
  tracks: TrackItem[];
  text_tracks?: string | null;
}
