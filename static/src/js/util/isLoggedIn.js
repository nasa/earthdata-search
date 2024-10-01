/**
 * Returns true if the authToken is not empty
 * @return {boolean}
 */

export const isLoggedIn = (authToken) => !(authToken === null || authToken === '')

export default isLoggedIn
