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
    minPlayers: 1,
    //coefficient: 3,
  },
  nightPhase: {
    class: WerewolfNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 1,
  },
};

//TODO: this is just a dummy type, we need to implement the werewolf role
export type WerewolfAction = { action: 'werewolf-kill'; personToKill: string };

export default werewolfRole;
