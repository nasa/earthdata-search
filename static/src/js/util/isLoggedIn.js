/**
 * Returns true if the authToken is not empty.
 * @param {String} authToken - The authToken for the logged in user.
 * @return {boolean}
 */

export const isLoggedIn = (authToken) => !(authToken === null || authToken === '')

export default isLoggedIn
