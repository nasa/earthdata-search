import { gql } from '@apollo/client'

const NLP_SEARCH_STATUS = gql`
  query NlpSearchStatus {
    nlpSearchStatus {
      disabled
    }
  }
`

export default NLP_SEARCH_STATUS
