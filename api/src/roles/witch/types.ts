import { Player } from 'src/game/classes/Player';
import { z } from 'zod';

enum WitchAction {
  KILL = 'kill',
  SAVE = 'save',
}

export const witchActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal(WitchAction.KILL),
    targetId: z.string(),
  }),
  z.object({
    action: z.literal(WitchAction.SAVE),
  }),
]);

export type WitchActionPayload = z.infer<typeof witchActionSchema>;

export interface WitchNightEndPayload {
  result: {
    action: 'kill' | 'save';
    target?: Player;
  };
}
