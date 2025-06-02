import { z } from 'zod';
import { GameRole } from '..';
import { SeerNightPhase } from './night-action';

export const SEER_ROLE_NAME = 'Seer' as const;
declare global {
  interface RoleNameMap {
    [SEER_ROLE_NAME]: true;
  }
}

const seerRole: GameRole = {
  roleData: {
    name: SEER_ROLE_NAME,
    team: 'villagers',
    description: 'see role at night.',
    maxPlayers: 1, // Only one seer can exist in the game
  },
  nightPhase: {
    class: SeerNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 2,
  },
};

export const SeerActionPayloadSchema = z.object({
  targetId: z.string(),
});

export type SeerActionPayload = z.infer<typeof SeerActionPayloadSchema>;

export default seerRole;
