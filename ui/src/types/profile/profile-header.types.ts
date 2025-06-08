export interface UserStats {
  wins: number;
  killCount: number;
}

export interface UserData {
  username: string;
  level: number;
  created_at: string;
  stats: UserStats;
  xp: number; // percentage 0-100
}
