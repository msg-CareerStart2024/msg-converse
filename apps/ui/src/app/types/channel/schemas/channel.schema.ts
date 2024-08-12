import { z } from 'zod';

export const channelNameCheck = z.string().min(1, 'Channel name is required');
export const descriptionCheck = z.string();
export const topicsCheck = z.string();

export const channelSchema = z.object({
    name: channelNameCheck,
    description: descriptionCheck,
    topics: topicsCheck
});

export type ChannelFormValues = z.infer<typeof channelSchema>;
