import { GraphQLError } from 'graphql'

import categorizeNlpFeedback from '../utils/categorizeNlpFeedback'
import sanitizeUserText from '../utils/sanitizeUserText'

// Matches the limits enforced by the SearchFormFeedback textarea and the nlpSearch handler
export const MAX_FEEDBACK_LENGTH = 500
export const MAX_NLP_QUERY_LENGTH = 500

/**
 * Throws a BAD_USER_INPUT error when `value` is longer than `maxLength`
 * @param {String|null} value The value to check
 * @param {Number} maxLength The maximum allowed length
 * @param {String} argumentName The argument name, used in the error message
 */
const assertMaxLength = (value, maxLength, argumentName) => {
  if (value && value.length > maxLength) {
    throw new GraphQLError(`${argumentName} must be ${maxLength} characters or fewer`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName
      }
    })
  }
}

export default {
  Mutation: {
    createNlpFeedback: async (parent, args, context) => {
      const { databaseClient = {} } = context

      const {
        nlpQuery,
        nlpRequestId,
        positive
      } = args

      const query = sanitizeUserText(nlpQuery) ?? ''
      assertMaxLength(query, MAX_NLP_QUERY_LENGTH, 'nlpQuery')

      return databaseClient.createNlpFeedback({
        id: nlpRequestId,
        positive,
        query
      })
    },

    updateNlpFeedback: async (parent, args, context) => {
      const { databaseClient = {} } = context

      const {
        incomplete,
        keyword,
        nlpRequestId,
        other,
        relevancy,
        spatial,
        temporal,
        feedback: rawFeedback
      } = args

      // Validate before categorizing so oversized input never reaches the LLM
      const feedback = sanitizeUserText(rawFeedback)
      assertMaxLength(feedback, MAX_FEEDBACK_LENGTH, 'feedback')

      // Categorize the feedback field
      const {
        incomplete: incompleteFeedback,
        keyword: keywordFeedback,
        other: otherFeedback,
        relevancy: relevancyFeedback,
        spatial: spatialFeedback,
        temporal: temporalFeedback
      } = await categorizeNlpFeedback(feedback ?? '')

      return databaseClient.updateNlpFeedback({
        id: nlpRequestId,
        incomplete: incomplete || incompleteFeedback,
        keyword: keyword || keywordFeedback,
        other: other || otherFeedback,
        relevancy: relevancy || relevancyFeedback,
        spatial: spatial || spatialFeedback,
        temporal: temporal || temporalFeedback,
        feedback
      })
    }
  }
}
