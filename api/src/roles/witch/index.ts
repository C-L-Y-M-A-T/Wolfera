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
  },
  nightPhase: {
    class: WitchNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 3,
  },
};

enum WitchAction {
  KILL = 'kill',
  SAVE = 'save',
}
export type WitchActionPayload = {
  targetId: string;
  action: WitchAction;
};

export default witchRole;
