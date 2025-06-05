import { GameOptions } from 'src/game/classes/types';

export const tempGameOptions: GameOptions = {
  roles: {
    Werewolf: 1,
    Seer: 1,
    Villager: 3,
  },
  totalPlayers: 3,
};

//TODO: if player wants to join a game, check if the game is full
//TODO: when updating game options, if totalPlayers is decreased, check if the number of players is still valid, you have to kick players if the number of players is greater than totalPlayers
//TODO: kick player
