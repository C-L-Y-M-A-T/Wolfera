export interface Role {
  id: string;
  name: string;
  team: "Good" | "Evil";
  shortDescription: string;
  detailedDescription: string;
  abilities: string[];
  tips: string[];
  winCondition: string;
  category: "villager" | "werewolf" | "seer" | "guardian" | "hunter" | "witch";
}
