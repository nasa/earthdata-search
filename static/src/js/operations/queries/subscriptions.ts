import { gql } from '@apollo/client'

const SUBSCRIPTIONS = gql`
  query Subscriptions ($params: SubscriptionsInput) {
    subscriptions (params: $params) {
      items {
        collection {
          conceptId
          title
        }
        collectionConceptId
        conceptId
        creationDate
        name
        nativeId
        query
        revisionDate
        type
      }
    }
  }
`

export default SUBSCRIPTIONS
