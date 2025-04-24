import { GameRole } from '..';
import { WerewolfNightPhase } from './night-action';

export const werewolfRole: GameRole = {
  roleData: {
    name: 'Werewolf',
    team: 'werewolves',
    description: 'Kill villagers at night.',
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
