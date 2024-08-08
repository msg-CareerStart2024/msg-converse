import { jwtDecode } from 'jwt-decode';

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
 * @param {Date} date - The input string.
 * @returns {string} - The formatted date as a string.
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
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
 * @returns {any} - The decoded token.
 */
export const decodeToken = (token: string) => {
    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp) {
            const currentTime = Date.now() / 1000;
            return !(decodedToken.exp < currentTime) && decodedToken;
        }

        return decodeToken;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};
