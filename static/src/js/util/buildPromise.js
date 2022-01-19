/**
 * Builds a promise object with a resolve method to manually create/return promises
 * @param {Object} response The value to return when the promise is resolved
 * @see {@link https://stackoverflow.com/questions/27715275/whats-the-difference-between-returning-value-or-promise-resolve-from-then|Stack Overflow}
 */
export const buildPromise = (response) => new Promise((resolve) => resolve(response))
