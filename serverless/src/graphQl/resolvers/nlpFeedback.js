export default {
  Mutation: {
    createNlpFeedback: (parent, args, context) => {
      const { databaseClient = {} } = context

      const {
        nlpRequestId,
        positive
      } = args

      return databaseClient.createNlpFeedback({
        id: nlpRequestId,
        positive
      })
    },

    updateNlpFeedback: (parent, args, context) => {
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

      return databaseClient.updateNlpFeedback({
        id: nlpRequestId,
        incomplete,
        keyword,
        other,
        relevancy,
        spatial,
        temporal,
        feedback
      })
    }
  }
}
