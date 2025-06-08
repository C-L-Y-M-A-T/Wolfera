export const VILLAGER_ROLE_NAME = 'Villager' as const;
declare global {
  interface RoleNameMap {
    [VILLAGER_ROLE_NAME]: true;
  }
}
const villagerRole = {
  roleData: {
    name: VILLAGER_ROLE_NAME,
    team: 'villagers',
    description: 'You are a villager. You have no special abilities.',
    minPlayers: 1,
    power: 1, // Power level for balancing
  },
};
export default villagerRole;
