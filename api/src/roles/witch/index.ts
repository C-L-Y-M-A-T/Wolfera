import { GameRole } from '..';
import { WitchNightPhase } from './night-action';

export const WITCH_ROLE_NAME = 'Witch' as const;
declare global {
  interface RoleNameMap {
    [WITCH_ROLE_NAME]: true;
  }
}

const witchRole: GameRole = {
  roleData: {
    name: WITCH_ROLE_NAME,
    team: 'villagers',
    description: 'see role at night.',
    maxPlayers: 1, // Only one witch can exist in the game
    power: 3, // Power level for balancing
  },
  nightPhase: {
    class: WitchNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 3,
  },
};

export default witchRole;
