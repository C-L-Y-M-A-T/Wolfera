import { z } from 'zod';
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

export const werewolfActionScema = z.object({
  targetId: z.string(),
});
export type WerewolfActionPayload = z.infer<typeof werewolfActionScema>;

export default werewolfRole;
