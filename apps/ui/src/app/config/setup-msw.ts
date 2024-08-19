import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { User } from '../types/login/User.types';
import { UserRole } from '../types/login/UserRole.enum';
import { LoginFormValues } from '../types/users/LoginFormValues.types';
import { SignupFormValues } from '../types/users/SignUpFormValues.types';
import { API_URLS, BASE_URL } from './api-config';

export const handlers = [
    http.post(`${BASE_URL}${API_URLS.AUTH}/login`, async ({ request }) => {
        const data = (await request.json()) as LoginFormValues;

        if (data.email === 'test@msg.group' && data.password === 'testPass') {
            return HttpResponse.json({
                user: {
                    id: '1',
                    email: 'test@msg.group',
                    role: UserRole.USER
                },
                token: 'fake-token'
            });
        }
        return new HttpResponse('Invalid credentials', { status: 401 });
    }),
    http.post(`${BASE_URL}${API_URLS.AUTH}/register`, async ({ request }) => {
        const data = (await request.json()) as SignupFormValues;
        if (
            data.firstName === 'Test' &&
            data.lastName === 'Hard' &&
            data.email === 'test@msg.group' &&
            data.password === 'testpass2!A@'
        ) {
            return HttpResponse.json(data);
        }
        return new HttpResponse('Incorrect request body', { status: 400 });
    }),
    http.get(`${BASE_URL}${API_URLS.USERS}/:id`, async ({ params }) => {
        const { id } = params;
        if (id === '1') {
            const user: User = {
                id: '1',
                email: 'test@msg.group',
                firstName: 'Test',
                lastName: 'Hard',
                role: UserRole.USER
            };
            return HttpResponse.json(user);
        }

        return new HttpResponse('User not found', { status: 404 });
    })
];

export const server = setupServer(...handlers);
