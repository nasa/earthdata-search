export default {
  Query: {
    colormaps: async (parent, args, context) => {
      const { databaseClient } = context
      const { products } = args

      const result = await databaseClient.getColorMapsByProducts(products)

      return result
    }
  }
}
