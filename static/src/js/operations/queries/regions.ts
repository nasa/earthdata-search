import { gql } from '@apollo/client'

const REGIONS = gql`
  query Regions(
    $endpoint: String
    $exact: Boolean
    $keyword: String
  ) {
    regions(
      endpoint: $endpoint
      exact: $exact
      keyword: $keyword
    ) {
      count
      keyword
      regions {
        id
        name
        spatial
        type
      }
    }
  }
`

export default REGIONS
