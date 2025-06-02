import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/nightPhase/rolePhase/role.phase';
import { PhaseConstructor } from 'src/game/classes/types';
import { z } from 'zod';
import seerRole from './seer';
import villagerRole from './villager';
import werewolfRole from './werewolf';
import witchRole from './witch';
//TODO: explain why I used zod instead of class-validator

declare global {
  interface RoleNameMap {
    // This will be augmented by each role
  }
}
export type RoleName = keyof RoleNameMap;
export const roleDetails = [
  werewolfRole,
  seerRole,
  villagerRole,
  witchRole,
] as GameRole[];

//TODO: add lovers
export type Team = 'villagers' | 'werewolves';

export type GameRole = {
  roleData: RoleData;
  nightPhase?: RoleNightPhase;
};

export type RoleNightPhase = {
  class: PhaseConstructor<RolePhase>;
  isActiveTonight: (context: GameContext) => boolean;
  nightPriority: number;
};
export type RoleData = {
  name: RoleName;
  team: Team;
  description: string;
  maxPlayers?: number; // Maximum number of players with this role, not define or 0 means unlimited
  minPlayers?: number; // Minimum number of players with this role, not define or 0 means unlimited
  //coefficient: number; // Coefficient for the role, used for balancing
};

export const RoleDataSchema = z
  .object({
    name: z.string(),
    team: z.enum(['villagers', 'werewolves']),
    description: z.string(),
    maxPlayers: z.number().optional(),
    minPlayers: z.number().optional(),
  })
  .strict();

export const RoleNightPhaseSchema = z
  .object({
    class: z.any(), //TODO: this should be a class
    isActiveTonight: z.function().returns(z.boolean()),
    nightPriority: z.number(),
  })
  .strict();

export const RoleSchema = z
  .object({
    roleData: RoleDataSchema,
    nightPhase: RoleNightPhaseSchema.optional(),
  })
  .strict();
