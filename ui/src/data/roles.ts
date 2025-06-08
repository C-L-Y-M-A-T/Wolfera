import { Role } from "@/types/role";

export const ROLES_DATA: Role[] = [
  {
    id: "villager",
    name: "Villager",
    team: "Good",
    category: "villager",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: false,
    actionTime: "day",
    shortDescription: "Innocent townspeople trying to survive",
    detailedDescription:
      "Villagers are the backbone of the town. They have no special abilities but must use their wit, observation skills, and voting power to identify and eliminate the werewolves threatening their community.",
    abilities: [
      "Vote during the day phase",
      "Participate in discussions",
      "No special night actions",
    ],
    tips: [
      "Pay attention to voting patterns and behavior",
      "Form alliances with trusted players",
      "Share information but be careful who you trust",
      "Look for inconsistencies in stories",
    ],
    winCondition: "Eliminate all werewolves",
  },
  {
    id: "werewolf",
    name: "Werewolf",
    canSeeWerewolfChat: true,
    canSendWerewolfChat: true,
    canChatDuringDay: true,
    canChatDuringNight: true,
    team: "Evil",
    actionTime: "night",
    category: "werewolf",
    shortDescription: "Creatures of the night hunting villagers",
    detailedDescription:
      "Werewolves are the primary antagonists who hunt during the night. They must eliminate villagers while blending in during the day, using deception and misdirection to avoid detection.",
    abilities: [
      "Kill one player each night (team decision)",
      "Communicate with other werewolves at night",
      "Vote and discuss during the day like everyone else",
    ],
    tips: [
      "Coordinate with your pack during night phases",
      "Act like a concerned villager during the day",
      "Don't be too aggressive in accusations",
      "Create confusion and misdirect suspicion",
    ],
    winCondition: "Equal or outnumber the villagers",
  },
  {
    id: "seer",
    name: "Seer",
    team: "Good",
    actionTime: "night",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: false,
    category: "seer",
    shortDescription: "Can see the true nature of players",
    detailedDescription:
      "The Seer has the mystical ability to peer into the souls of other players, learning their true allegiance. This powerful role must use their knowledge wisely while staying hidden from the werewolves.",
    abilities: [
      "Investigate one player each night",
      "Learn if the target is a werewolf or not",
      "Vote and discuss during the day",
    ],
    tips: [
      "Don't reveal yourself too early",
      "Build a network of trusted allies",
      "Use your information strategically",
      "Be prepared to prove your role if necessary",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "guardian",
    name: "Guardian",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: false,
    team: "Good",
    actionTime: "night",
    category: "guardian",
    shortDescription: "Protects players from werewolf attacks",
    detailedDescription:
      "The Guardian is the town's protector, capable of shielding one person each night from werewolf attacks. Their protective powers are crucial for keeping key players alive.",
    abilities: [
      "Protect one player each night from elimination",
      "Cannot protect the same player twice in a row",
      "Cannot protect themselves",
    ],
    tips: [
      "Protect players you suspect are important roles",
      "Vary your protection patterns",
      "Pay attention to who might be targeted",
      "Stay hidden to avoid being eliminated",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "hunter",
    name: "Hunter",
    team: "Good",
    actionTime: "day",
    category: "hunter",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: false,
    shortDescription: "Takes revenge when eliminated",
    detailedDescription:
      "The Hunter is a skilled marksman who, even in death, can take one final shot. When eliminated, they can choose to eliminate another player, making them a dangerous target for werewolves.",
    abilities: [
      "When eliminated, can immediately eliminate another player",
      "This ability works regardless of how they die",
      "Vote and discuss during the day",
    ],
    tips: [
      "Don't reveal your role unless necessary",
      "Save your shot for confirmed werewolves",
      "Be observant to make the best final choice",
      "Consider the game state when using your ability",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "witch",
    name: "Witch",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    team: "Good",
    actionTime: "day",
    category: "witch",
    canChatDuringDay: true,
    canChatDuringNight: false,
    shortDescription: "Has healing and poison potions",
    detailedDescription:
      "The Witch possesses two powerful potions: one that can save a life and another that can take one. These single-use abilities make the Witch a versatile but vulnerable role.",
    abilities: [
      "Healing potion: Save the werewolf victim (once per game)",
      "Poison potion: Eliminate any player (once per game)",
      "Can use both potions in the same night",
    ],
    tips: [
      "Save your healing potion for crucial moments",
      "Use poison on confirmed werewolves",
      "Don't waste potions early in the game",
      "Coordinate with other roles if possible",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "little-girl",
    name: "Little Girl",
    team: "Good",
    actionTime: "day",
    category: "little-girl",
    canSeeWerewolfChat: true,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: true,
    shortDescription: "Can observe the werewolves' conversation",
    detailedDescription:
      "The Little Girl is a curious and observant player who can observe the werewolves' conversation without being detected. This role is essential for the game's success, as it allows the villagers to communicate with each other and identify the werewolves.",
    abilities: [
      "Observe the werewolves' conversation",
      "Vote and discuss during the day",
      "No special night actions",
    ],
    tips: [
      "Pay attention to the werewolves' conversation",
      "Share information with trusted players",
      "Don't be too eager to reveal your role",
      "Be cautious when communicating with others",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "cupid",
    name: "Cupid",
    team: "Good",
    actionTime: "day",
    category: "cupid",
    canSeeWerewolfChat: false,
    canSendWerewolfChat: false,
    canChatDuringDay: true,
    canChatDuringNight: true,
    shortDescription: "Chooses two players to make them lovers",
    detailedDescription:
      "The Cupid is a player who chooses two players to make them lovers. This role is crucial for the game's success, as it allows the villagers to form alliances and identify the werewolves.",
    abilities: [
      "On the first night, choose two players to make them lovers",
      "Vote and discuss during the day",
      "No special night actions",
    ],
    tips: [
      "Be observant and pay attention to the game state",
      "Communicate with trusted players",
      "Don't be too eager to reveal your role",
      "Be cautious when communicating with others",
    ],
    winCondition: "Help eliminate all werewolves",
  },
];

export const getRole = (roleId: string): Role | undefined => {
  return ROLES_DATA.find((role) => role.id === roleId);
};

export const getRolesByTeam = (team: "Good" | "Evil"): Role[] => {
  return ROLES_DATA.filter((role) => role.team === team);
};
