export interface UserStats {
  wins: number;
  killCount: number;
}

export interface UserData {
  username: string;
  level: number;
  joinDate: string;
  stats: UserStats;
  xp: number; // percentage 0-100
}
