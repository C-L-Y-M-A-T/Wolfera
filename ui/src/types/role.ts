export interface Role {
  id: string;
  name: string;
  team: "Good" | "Evil";
  shortDescription: string;
  detailedDescription: string;
  abilities: string[];
  tips: string[];
  actionTime: "night" | "day";
  winCondition: string;
  category:
    | "villager"
    | "werewolf"
    | "seer"
    | "guardian"
    | "hunter"
    | "witch"
    | "little-girl"
    | "cupid";
  canSendWerewolfChat: boolean;
  canSeeWerewolfChat: boolean;
  canChatDuringDay: boolean;
  canChatDuringNight: boolean;
}
