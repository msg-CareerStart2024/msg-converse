import { z } from 'zod';

export const ChannelFormSchema = z.object({
    name: z.string().min(1, 'Channel name is required'),
    description: z.string(),
    topics: z.string().min(1, 'Topic name is required')
});

export type ChannelFormValues = z.infer<typeof ChannelFormSchema>;
