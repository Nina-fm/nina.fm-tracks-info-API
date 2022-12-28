export interface Track {
  title?: string;
  artist?: string;
  position?: number;
  start_at?: number;
  duration?: number;
}

export interface Mixtape {
  id: string;
  author: string;
  name: string;
  cover?: string;
  coverUrl?: string;
  year?: string | null;
  tags?: string[];
  comments?: string | null;
  tracks?: Track[];
  tacks_text?: string | null;
}
