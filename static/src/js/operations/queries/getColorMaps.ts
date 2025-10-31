import { gql } from '@apollo/client'

const GET_COLORMAPS = gql`
  query GetColorMaps($products: [String!]!) {
    colormaps(products: $products) {
      id
      product
      url
      jsonData
      createdAt
      updatedAt
    }
  }
`

export default GET_COLORMAPS
