import { rule } from 'graphql-shield'
import { isEmpty } from 'lodash-es'

/**
 * Checks if the user is valid (i.e., not empty)
 * @returns {boolean} true if the user is valid, false otherwise
 */
const isValidUser = rule()(async (parent, args, context) => !isEmpty(context.user))

export default isValidUser
