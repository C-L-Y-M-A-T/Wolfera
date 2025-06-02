// GraphQL Types based on your schema

export enum Badge {
  FIRST_WIN = "FIRST_WIN",
  MOON_SURVIVOR = "MOON_SURVIVOR",
  NEW_PLAYER = "NEW_PLAYER",
  VILLAGE_HERO = "VILLAGE_HERO",
  WEREWOLF_WIN = "WEREWOLF_WIN",
}

export interface FriendDto {
  id: string
  username: string
  email: string
  avatar_url?: string
  badges: Badge[]
  gamesPlayed: number
  gamesWon: number
  gamesAsVillager: number
  gamesAsWerewolf: number
}

export interface UserDto {
  id: string
  username: string
  email: string
  avatar_url?: string
  badges: Badge[]
  gamesPlayed: number
  gamesWon: number
  gamesAsVillager: number
  gamesAsWerewolf: number
  friends: FriendDto[]
}

export interface User {
  username: string
  email: string
  avatar_url?: string
  badges: Badge[]
  gamesPlayed: number
  gamesWon: number
  gamesAsVillager: number
  gamesAsWerewolf: number
  hashedPassword: string
  friends: User[]
}

// Computed/derived types for the UI
export interface ProfileStats {
  gamesPlayed: number
  gamesWon: number
  winRate: string
  gamesAsVillager: number
  gamesAsWerewolf: number
  favoriteRole: "Villager" | "Werewolf"
  killCount: number // This might need to be added to your schema
  survivedNights: number // This might need to be added to your schema
}

export interface Achievement {
  id: number
  name: string
  description: string
  unlocked: boolean
  date?: string
  badge: Badge
}

export interface RecentGame {
  id: string
  date: string
  result: "Win" | "Loss"
  role: string
  players: number
}
