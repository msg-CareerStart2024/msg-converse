import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { API_URLS, BASE_URL } from '../app/config/api-config';
import { UserRole } from '../app/types/login/UserRole';
import { LoginFormValues } from '../app/types/users/login.types';
import { SignupFormValues } from '../app/types/users/signup.types';

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
    })
];

export const server = setupServer(...handlers);
