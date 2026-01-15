import { gql } from '@apollo/client'

const DELETE_RETRIEVAL = gql`
  mutation DeleteRetrieval($obfuscatedId: String!) {
    deleteRetrieval(obfuscatedId: $obfuscatedId)
  }
`

export default DELETE_RETRIEVAL
