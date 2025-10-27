export default {
  Query: {
    // Colormap: async (parent, args, context) => {
    //   console.log('🚀 ~ colormap resolver ~ args:', args)
    //   console.log('🚀 ~ colormap resolver ~ context keys:', Object.keys(context))

    //   const { databaseClient } = context
    //   const { product } = args
    //   console.log('🚀 ~ colormap resolver ~ product:', product)
    //   console.log('🚀 ~ colormap resolver ~ databaseClient available:', !!databaseClient)

    //   const result = await databaseClient.getColorMapByProduct(product)
    //   console.log('🚀 ~ colormap resolver ~ result:', result)

    //   return result
    // },

    colormaps: async (parent, args, context) => {
      console.log('🚀 ~ colormaps resolver ~ args:', args)
      console.log('🚀 ~ colormaps resolver ~ context keys:', Object.keys(context))

      const { databaseClient } = context
      const { products } = args
      console.log('🚀 ~ colormaps resolver ~ products:', products)
      console.log('🚀 ~ colormaps resolver ~ databaseClient available:', !!databaseClient)

      const result = await databaseClient.getColorMapsByProducts(products)
      console.log('🚀 ~ colormaps resolver ~ result:', result)

      return result
    }
  }
}
