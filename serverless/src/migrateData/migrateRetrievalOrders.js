import 'array-foreach-async'

export const migrateRetrievalOrders = async (oldDbConnection, newDbConnection) => {
  const oldRetrievals = await oldDbConnection('orders')
    .select([
      'id',
      'retrieval_collection_id',
      'type',
      'search_params',
      'order_number',
      'state',
      'order_information',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  await oldRetrievals.forEachAsync(async (oldAccessConfigration) => {
    const {
      id,
      retrieval_collection_id: retrievalCollectionId,
      type,
      search_params: searchParams,
      order_number: orderNumber,
      state,
      order_information: orderInformation = '{}',
      created_at: createdAt,
      updated_at: updatedAt
    } = oldAccessConfigration

    let orderType
    if (type === 'LegacyServicesOrder') {
      orderType = 'ECHO ORDERS'
    } else {
      orderType = 'ESI'
    }

    try {
      await newDbConnection('retrieval_orders').insert({
        id,
        retrieval_collection_id: retrievalCollectionId,
        type: orderType,
        granule_params: JSON.parse(searchParams),
        order_number: orderNumber,
        state,
        order_information: JSON.parse(orderInformation || '{}') || {},
        created_at: createdAt,
        updated_at: updatedAt
      })

      console.log(`Successfully inserted retrieval order record with ID ${id}`)
    } catch (e) {
      console.log(e.message)
    }
  })
}
