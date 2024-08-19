import '@testing-library/jest-dom';
import { server } from './setup-msw';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
