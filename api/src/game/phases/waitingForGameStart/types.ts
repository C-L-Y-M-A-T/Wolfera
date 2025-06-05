import { z } from 'zod';

export const waitingForGameStartPlayerActionSchema = z.object({
  action: z.literal('start-game'),
});

export type WaitingForGameStartPlayerAction = z.infer<
  typeof waitingForGameStartPlayerActionSchema
>;
