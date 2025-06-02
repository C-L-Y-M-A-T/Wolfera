import { z } from 'zod';

enum WitchAction {
  KILL = 'kill',
  SAVE = 'save',
}

export const witchActionSchema = z.object({
  targetId: z.string(),
  action: z.nativeEnum(WitchAction),
});
export type WitchActionPayload = z.infer<typeof witchActionSchema>;
