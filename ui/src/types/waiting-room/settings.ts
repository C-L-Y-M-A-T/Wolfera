export interface GameSettings {
  roles: {
    werewolf: number;
    villager: number;
    seer: number;
    hunter: number;
    witch: number;
  };
  nightDuration: number;
  dayDuration: number;
  discussionTime: number;
  votingTime: number;
}
