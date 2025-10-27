const GET_COLORMAPS = `
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
