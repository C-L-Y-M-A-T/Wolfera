import { GameRole, RoleData } from '..';
import { WerewolfNightPhase } from './night-action';

export const WerewolfRole: RoleData = {
  name: 'Werewolf',
  team: 'werewolves',
  description: 'Kill villagers at night.',
  canActAtNight: true,
  nightPriority: 1,
};

const werewolfRoleData: GameRole = {
  roleData: WerewolfRole,
  nightPhase: WerewolfNightPhase,
};

//TODO: this is just a dummy type, we need to implement the werewolf role
export type WerewolfAction = { action: 'werewolf-kill'; personToKill: string };

export default werewolfRoleData;
