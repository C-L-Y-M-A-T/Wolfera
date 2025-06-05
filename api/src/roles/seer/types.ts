import { z } from 'zod';

export const SeerActionPayloadSchema = z.object({
  targetId: z.string(),
});

export type SeerActionPayload = z.infer<typeof SeerActionPayloadSchema>;
