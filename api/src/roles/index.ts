import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';
import { z } from 'zod';
//TODO: explain why I used zod instead of class-validator

export type GameRole = {
  roleData: RoleData;
  nightPhase?: new (context: GameContext) => GamePhase;
  // Optional night behavior
};

export type RoleData = {
  name: string;
  team: string;
  description: string;
  canActAtNight?: boolean; // Signals that this role has a night phase
  nightPriority?: number; // Execution order (werewolves act before seer/witch)
};

export const RoleDataSchema = z
  .object({
    name: z.string(),
    team: z.string(),
    description: z.string(),
    canActAtNight: z.boolean().optional(),
    nightPriority: z.number().optional(),
  })
  .strict();

export const RoleSchema = z
  .object({
    roleData: RoleDataSchema,
    nightPhase: z.any().optional(), // TODO: Add type check for GamePhase
  })
  .strict();

/*
export class RoleData {
  @IsString()
  name: string;

  @IsString()
  team: string; //TODO: maybe make this an enum

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  canActAtNight?: boolean;

  @IsOptional()
  @IsNumber()
  nightPriority?: number;
}

export class RoleModule {
  @ValidateNested()
  @Type(() => RoleData)
  data: RoleData;

  @IsOptional()
  nightPhase?: typeof GamePhase<PlayerAction>;
}
*/
