import { gql } from '@apollo/client'

const EXPORT_COLLECTIONS = gql`
  query ExportCollections (
    $params: CollectionsInput
  ) {
    collections (
      params: $params
    ) {
      cursor
      count
      items {
        provider
        shortName
        version
        title
        processingLevel
        platforms
        timeStart
        timeEnd
      }
    }
  }
`

export default EXPORT_COLLECTIONS
