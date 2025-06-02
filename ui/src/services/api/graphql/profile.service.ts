import { apolloClient } from "@/lib/graphql/client";
import { GET_ME, GET_USER_PROFILE, GET_ALL_USERS } from "@/lib/graphql/queries";
import {
  UserDto,
  ProfileStats,
  Badge,
  Achievement,
  RecentGame,
} from "@/lib/graphql/types";

export class ProfileService {
  /**
   * Get current user's profile
   */
  static async getMyProfile(): Promise<UserDto> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ME,
        fetchPolicy: "cache-first", // Use cache if available, otherwise fetch
      });

      return data.me;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Get a specific user's profile by username
   */
  static async getUserProfile(username: string): Promise<UserDto> {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_PROFILE,
        variables: { username },
        fetchPolicy: "cache-first",
      });

      return data.userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Get all users (for friend suggestions)
   */
  static async getAllUsers(): Promise<UserDto[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_USERS,
        fetchPolicy: "cache-first",
      });

      return data.allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Transform UserDto to ProfileStats for UI components
   */
  static transformToProfileStats(user: UserDto): ProfileStats {
    const winRate =
      user.gamesPlayed > 0
        ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) + "%"
        : "0%";

    const favoriteRole =
      user.gamesAsWerewolf > user.gamesAsVillager ? "Werewolf" : "Villager";

    return {
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      winRate,
      gamesAsVillager: user.gamesAsVillager,
      gamesAsWerewolf: user.gamesAsWerewolf,
      favoriteRole,
      // These would need to be added to your GraphQL schema
      killCount: 0, // Placeholder
      survivedNights: 0, // Placeholder
    };
  }

  /**
   * Transform badges to achievements for UI components
   */
  static transformBadgesToAchievements(badges: Badge[]): Achievement[] {
    const badgeDefinitions: Record<
      Badge,
      { name: string; description: string }
    > = {
      [Badge.FIRST_WIN]: {
        name: "First Blood",
        description: "Win your first game",
      },
      [Badge.MOON_SURVIVOR]: {
        name: "Moon Survivor",
        description: "Survive a full moon night",
      },
      [Badge.NEW_PLAYER]: {
        name: "Welcome to Miller's Hollow",
        description: "Join your first game",
      },
      [Badge.VILLAGE_HERO]: {
        name: "Village Hero",
        description: "Save the village as a villager",
      },
      [Badge.WEREWOLF_WIN]: {
        name: "Pack Leader",
        description: "Win a game as a werewolf",
      },
    };

    return Object.values(Badge).map((badge, index) => ({
      id: index + 1,
      name: badgeDefinitions[badge].name,
      description: badgeDefinitions[badge].description,
      unlocked: badges.includes(badge),
      badge,
      date: badges.includes(badge) ? "Recently" : undefined, // You might want to add timestamps to your schema
    }));
  }

  /**
   * Generate mock recent games (since this data isn't in your schema yet)
   * You might want to add a games history to your GraphQL schema
   */
  static generateMockRecentGames(user: UserDto): RecentGame[] {
    const games: RecentGame[] = [];
    const roles = ["Villager", "Werewolf", "Seer", "Hunter"];

    for (let i = 0; i < Math.min(4, user.gamesPlayed); i++) {
      games.push({
        id: `game_${i + 1}`,
        date: `${i + 1} ${i === 0 ? "hour" : "days"} ago`,
        result: Math.random() > 0.5 ? "Win" : "Loss",
        role: roles[Math.floor(Math.random() * roles.length)],
        players: Math.floor(Math.random() * 8) + 6, // 6-14 players
      });
    }

    return games;
  }

  /**
   * Refresh user profile cache
   */
  static async refreshProfile(): Promise<void> {
    try {
      await apolloClient.refetchQueries({
        include: [GET_ME],
      });
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  }

  /**
   * Clear profile cache (useful for logout)
   */
  static clearCache(): void {
    apolloClient.cache.reset();
  }
}
