import { z } from 'zod';

export const ChannelFormSchema = z.object({
    name: z.string().min(1, 'Channel name is required'),
    description: z.string(),
    topics: z.string()
});

export type ChannelFormValues = z.infer<typeof ChannelFormSchema>;
