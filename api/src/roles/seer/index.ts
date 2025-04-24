import { GameRole } from '..';
import { SeerNightPhase } from './night-action';

const seerRoleData: GameRole = {
  roleData: {
    name: 'seer',
    team: 'villagers',
    description: 'see role at night.',
  },
  nightPhase: {
    class: SeerNightPhase,
    isActiveTonight: (context) => true,
    nightPriority: 2,
  },
};

export default seerRoleData;
