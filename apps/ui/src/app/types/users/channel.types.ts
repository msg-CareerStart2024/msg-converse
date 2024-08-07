import { z } from 'zod';

export const channelNameCheck = z.string().min(1, 'Channel name is required');
export const descriptionCheck = z.string().min(1, 'Description is required');
export const topicsCheck = z.array(z.string()).min(1, 'At least one topic is required');

export const channelSchema = z.object({
    channelName: channelNameCheck,
    description: descriptionCheck,
    topics: topicsCheck
});

export type ChannelFormValues = z.infer<typeof channelSchema>;
