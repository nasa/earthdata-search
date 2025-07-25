import { rule } from 'graphql-shield'

/**
 * Checks if the user is valid (i.e., not empty)
 * @returns {boolean} true if the user is valid, false otherwise
 */
const isValidUser = rule()(async (parent, args, context) => !!context.user)

export default isValidUser
