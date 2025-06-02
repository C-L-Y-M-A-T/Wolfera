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
  },
  nightPhase: {
    class: WerewolfNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 1,
  },
};

export const werewolfActionSchema = z.object({
  targetId: z.string(),
  action: z.union([
    z.literal('skip'),
    z.literal('change-vote'),
    z.literal('vote'),
  ]),
});
export type WerewolfActionPayload = z.infer<typeof werewolfActionSchema>;

export default werewolfRole;
