import { convertSize } from './project'

/**
 * Returns an estimate of the total granule size for a collection.
 * Takes the average granule size of the granules downloaded and multiplies that
 * number by the total number of granules in the collection
 * @param {Array} granules Array of granule metadata objects
 * @param {Integer} hits Number of total granule results
 */
export const calculateTotalSize = (granules, hits) => {
  let size = 0
  granules.forEach((granule) => {
    const { granule_size: granuleSize = 0 } = granule
    size += parseFloat(granuleSize)
  })

  const totalSize = size / granules.length * hits

  return convertSize(totalSize)
}
