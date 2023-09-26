/**
 * Parse the retrievals
 * @param {Object} retrievals - The list of retrievals
 * @return {String} The metrics for the retrievals
 */
// todo fix the doc-string
export const adminRetrievalMetrics = (retrievals) => {
  // console.log('🚀 ~ file: adminRetrievalMetrics.js:8 ~ adminRetrievalMetrics ~ retrievals:', retrievals)
  // const { byId } = retrievals

  // // Get the number of times each retrieval has been used
  // const metrics = {}

  // const retrievedCollection = Object.keys(byId)

  // retrievedCollection.forEach((id) => {
  //   const retrieval = byId[id]
  //   const { access_method_type: accessMethodType } = retrieval

  //   if (metrics[accessMethodType]) {
  //     metrics[accessMethodType] += 1
  //   } else {
  //     metrics[accessMethodType] = 1
  //   }
  // })
  console.log('skip function for now')

  // data.forEach(item => {
  //   const accessMethodType = item.access_method_type;
  //   if (counts[accessMethodType]) {
  //     counts[accessMethodType]++;
  //   } else {
  //     counts[accessMethodType] = 1;
  //   }
  // });

  // Print the counts
  // const {
  //   collections = [],
  //   jsondata = {},
  //   obfuscated_id: obfuscatedId,
  //   username
  // } = retrieval

  // byId.forEach((retrievalId) => {
  //   console.log(retrievalId.access_method.type)
  // })
  // const totalGranluleCount = retrievals.reduce((accumulator, currentValue) => {
  //   accumulator + currentValue, initialValue
  // })
  // todo get average number of granule counts per download
  // todo get map of what type they were and how many retrievals {downloads: 5, harmony: 10, echoOrder: 15} etc
  return retrievals
}
