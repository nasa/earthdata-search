import fetch from 'node-fetch'

/**
 * Given a concept id, fetch the metadata for granules
 * @param {String} conceptId A collection concept id to return granules for
 * @param {String} cmrEndpoint The collection or granule search URL
 * @returns {JSON} the collection associated with the supplied id
 */
export const fetchCmrCollectionGranules = async (conceptId) => {
  const headers = {}

  const response = await fetch(`${process.env.cmrRootUrl}/search/granules.json?collection_concept_id=${conceptId}`, {
    method: 'GET',
    headers
  })
    .then((res) => res.json())
    .then((json) => {
      const {
        errors,
        feed
      } = json
      console.log('🚀 ~ file: fetchCmrCollectionGranules.js:22 ~ .then ~ errors:', errors)

      if (errors) {
        console.log('🚀 ~ file: fetchCmrCollectionGranules.js:24 ~ .then ~ errors:', errors)
        // On failure throw an exception
        const [firstError] = errors

        throw new Error(firstError)
      }

      // Return the first page of granules as an array
      const { entry } = feed

      return entry
    })
    .catch((error) => {
      console.log('🚀 ~ file: fetchCmrCollectionGranules.js:36 ~ fetchCmrCollectionGranules ~ error:', error)
      console.log(error.toString())

      return {
        errors: [
          error.toString()
        ]
      }
    })

  return response
}
