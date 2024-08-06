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
