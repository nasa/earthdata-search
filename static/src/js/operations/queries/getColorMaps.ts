import { gql } from '@apollo/client'

const GET_COLORMAPS = gql`
  query GetColorMaps($products: [String!]!) {
    colormaps(products: $products) {
      product
      jsondata
    }
  }
`

export default GET_COLORMAPS
