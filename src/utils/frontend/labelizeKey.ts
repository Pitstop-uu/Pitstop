/**
   * Converts a key into a human-readable format with proper capitalization.
   * 
   * This function checks if the key is listed in a set of exceptions (e.g., 
   * "rb" -> "RB", "alphatauri" -> "AlphaTauri"). If the key is not in the 
   * exceptions list, the function will replace hyphens with spaces and capitalize 
   * the first letter of each word in the string.
   * 
   * @param {string} key - The key to be formatted.
   * @returns {string} - The formatted string with capitalized words, or the special transformation for exception keys.
   * 
   * @example
   * // If key is "some-key"
   * labelizeKey("some-key"); // Returns "Some Key"
   */
const labelizeKey = (key: string): string => {

    const exceptions: { [key: string]: string } = {
        'rb': 'RB',
        'alphatauri': 'AlphaTauri',
        'mclaren': 'McLaren',
        'hrt': 'HRT',
        'bmw-sauber': 'BMW Sauber',
        'ags': 'AGS',
        'first': 'FIRST',
        'ram': 'RAM',
        'ats-wheels': 'ATS Wheels',
        'brm': 'BRM',
        'mcguire': 'McGuire',
        'hill': 'Embassy Hill',
    };

    if (exceptions[key]) {
        return exceptions[key];
    }

    const formattedKey = key.replace(/-/g, ' ');
    return formattedKey
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default labelizeKey;