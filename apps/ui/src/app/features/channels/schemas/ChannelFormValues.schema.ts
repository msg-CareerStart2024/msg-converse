import { z } from 'zod';

export const ChannelFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Channel name is required')
        .max(50, "Channel name can't be longer than 50 characters"),
    description: z.string().max(250, "Description can't be longer than 250 characters"),
    topics: z.string()
});

export type ChannelFormValues = z.infer<typeof ChannelFormSchema>;
