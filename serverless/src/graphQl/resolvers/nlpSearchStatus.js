import { isNlpSearchDisabled } from '../../util/isNlpSearchDisabled'

export default {
  Query: {
    nlpSearchStatus: async () => ({
      disabled: await isNlpSearchDisabled()
    })
  }
}
