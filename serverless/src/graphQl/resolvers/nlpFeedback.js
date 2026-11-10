import categorizeNlpFeedback from '../utils/categorizeNlpFeedback'

export default {
  Mutation: {
    createNlpFeedback: async (parent, args, context) => {
      const { databaseClient = {} } = context

      const {
        nlpQuery,
        nlpRequestId,
        positive
      } = args

      return databaseClient.createNlpFeedback({
        id: nlpRequestId,
        positive,
        query: nlpQuery
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
        feedback
      } = args

      // Categorize the feedback field
      const {
        incomplete: incompleteFeedback,
        keyword: keywordFeedback,
        other: otherFeedback,
        relevancy: relevancyFeedback,
        spatial: spatialFeedback,
        temporal: temporalFeedback
      } = await categorizeNlpFeedback(feedback)

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
