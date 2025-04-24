import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/rolePhase/role.phase';
import { z } from 'zod';
//TODO: explain why I used zod instead of class-validator

export type GameRole = {
  roleData: RoleData;
  nightPhase?: RoleNightPhase;
  // Optional night behavior
};

export type RoleNightPhase = {
  class: new (context: GameContext) => RolePhase;
  isActiveTonight: (context: GameContext) => boolean;
  nightPriority: number;
};

export type RoleData = {
  name: string;
  team: string;
  description: string;
};

export const RoleDataSchema = z
  .object({
    name: z.string(),
    team: z.string(),
    description: z.string(),
  })
  .strict();

export const RoleNightPhaseSchema = z
  .object({
    class: z.any(), //TODO: this should be a class
    isActiveTonight: z
      .function()
      .returns(z.boolean()),
    nightPriority: z.number(),
  })
  .strict();

export const RoleSchema = z
  .object({
    roleData: RoleDataSchema,
    nightPhase: RoleNightPhaseSchema.optional(),
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
