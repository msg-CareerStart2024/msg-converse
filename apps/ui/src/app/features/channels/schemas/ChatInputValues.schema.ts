import { z } from 'zod';

export const ChannelChatSchema = z.object({
    message: z.string().max(1000, 'You have reached the maximum message length')
});

export type ChannelChatValues = z.infer<typeof ChannelChatSchema>;
