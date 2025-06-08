import { GameRole } from '..';
import { WerewolfNightPhase } from './night-action';

export const WEREWOLF_ROLE_NAME = 'Werewolf' as const;
declare global {
  interface RoleNameMap {
    [WEREWOLF_ROLE_NAME]: true;
  }
}

export const werewolfRole: GameRole = {
  roleData: {
    name: WEREWOLF_ROLE_NAME,
    team: 'werewolves',
    description: 'Kill villagers at night.',
    minPlayers: 1, // At least one werewolf is required
    power: 3, // Power level for balancing
  },
  nightPhase: {
    class: WerewolfNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 1,
  },
};

export default werewolfRole;
