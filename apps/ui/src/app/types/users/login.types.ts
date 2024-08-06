import { z } from 'zod';

export const emailSchemaCheck = z.string().email('You have to provide a valid email!');
export const passwordSchemaCheck = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

export const userSchema = z.object({
    email: emailSchemaCheck,
    password: passwordSchemaCheck
});

export type UserFormValues = z.infer<typeof userSchema>;
