import { AppUser } from "@/context/auth-context";
import { GameSettings } from "@/types/dashboard/game-options";
import apiClient from "../api/client";
import { GAME_BASE_URL, gameEndpoints } from "./api";
import { CreateGameResponse } from "./types";

class GameService {
  public static instance = new GameService();

  private constructor() {}

  public static getInstance() {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  public async createGame(
    gameOptions: GameSettings,
    user: AppUser,
  ): Promise<CreateGameResponse> {
    const res = await apiClient.post(GAME_BASE_URL + gameEndpoints.create, {
      userId: user.id,
      username: user.username,
      gameOptions: {
        ...gameOptions,
        roles: {
          ...gameOptions.roles,
          Villager:
            gameOptions.totalPlayers -
            Object.values(gameOptions.roles).reduce((sum, val) => sum + val, 0),
        },
      },
    });
    return res.data as CreateGameResponse;
  }
}

export const gameService = GameService.getInstance();
