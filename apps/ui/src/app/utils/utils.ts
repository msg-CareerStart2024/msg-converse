import { jwtDecode, JwtPayload } from 'jwt-decode';
import { darkScrollbar, darkTheme, lightScrollbar, lightTheme } from '../lib/themes';

/**
 * Shrinks a string to a specified number of words.
 * @param {string} text - The input string.
 * @param {number} wordsNumber - The number of words to keep.
 * @returns {string} - The shrunken string.
 */
export function shrinkToWords(text: string, wordsNumber: number): string {
    const words = text.split(' ');
    if (words.length <= wordsNumber) {
        return text;
    }
    return words.slice(0, wordsNumber).join(' ') + '...';
}

/**
 * Formats the date like: August 19, 2021.
 * @param {Date | string} date - The input string.
 * @returns {string} - The formatted date as a string.
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generates a username from the first and last name.
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @returns {string} - The generated username.
 */
export function generateUserName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}

/**
 * Decodes a JWT token and checks if it is expired.
 * @param {string} token - The JWT token.
 * @returns {JwtPayload | null} - The decoded token.
 */
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp) {
            const isTokenValid = decodedToken.exp > Date.now() / 1000;
            return isTokenValid ? decodedToken : null;
        }
        return decodedToken;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Adds a Bearer token from localStorage to the headers.
 */
export const addBearerAuthHeader = (headers: Headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
};

/**
 * Returns the Theme.
 */
export const getTheme = (theme: 'dark' | 'light' | 'system', prefersDarkMode: boolean) => {
    if (theme === 'dark') {
        return darkTheme;
    }
    if (theme === 'light') {
        return lightTheme;
    }

    if (prefersDarkMode) {
        return darkTheme;
    }
    return lightTheme;
};

/**
 * Returns the scrollbar design.
 */
export const getScrollbar = (theme: 'dark' | 'light' | 'system', prefersDarkMode: boolean) => {
    if (theme === 'dark') {
        return darkScrollbar;
    }
    if (theme === 'light') {
        return lightScrollbar;
    }

    if (prefersDarkMode) {
        return darkScrollbar;
    }
    return lightScrollbar;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} text - Initial text.
 * @returns {string} - The transformed text.
 */
export const capitalizeFirstLetter = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
