import { z } from 'zod';

const topicSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const channelNameCheck = z.string().min(1, 'Channel name is required');
export const descriptionCheck = z.string();
export const topicsCheck = z.array(topicSchema).min(1, 'At least one topic is required');

export const channelSchema = z.object({
    name: channelNameCheck,
    description: descriptionCheck,
    topics: topicsCheck
});

export type ChannelFormValues = z.infer<typeof channelSchema>;
