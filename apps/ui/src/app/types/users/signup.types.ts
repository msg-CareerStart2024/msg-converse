import { z } from 'zod';

export const firstNameSchemaCheck = z
    .string()
    .min(2, 'First name must be at least 2 characters long');
export const lastNameSchemaCheck = z
    .string()
    .min(2, 'Last name must be at least 2 characters long');
export const emailSchemaCheck = z.string().email('You have to provide a valid email');
export const passwordSchemaCheck = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

export const signUpSchema = z.object({
    firstName: firstNameSchemaCheck,
    lastName: lastNameSchemaCheck,
    email: emailSchemaCheck,
    password: passwordSchemaCheck
});

export type SignupFormValues = z.infer<typeof signUpSchema>;
