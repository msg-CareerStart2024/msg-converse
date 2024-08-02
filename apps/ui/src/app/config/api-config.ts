// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: 2339
const VITE_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const RUNTIME_BASE_URL = '<!--# echo var="ENV_API_BASE_URL" -->';
const DEFAULT_BASE_URL = 'http://localhost:3000/api';

/**
 * Retrieve api base url in the following order of precedence (descending):
 * - RUNTIME_BASE_URL: dynamically set at runtime
 * - VITE_BASE_URL: dynamically set at build time
 * - DEFAULT_BASE_URL: fallback value if the others are not set
 */
const getBaseUrl = () => {
    try {
        return new URL(RUNTIME_BASE_URL).href;
    } catch {
        return VITE_BASE_URL || DEFAULT_BASE_URL;
    }
};

export const BASE_URL = getBaseUrl();
