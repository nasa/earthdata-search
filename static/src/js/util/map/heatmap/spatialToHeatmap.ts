import Request from '../../request/request'
import { GranuleMetadata } from '../../../types/sharedTypes'
import { pageAllCmrResults } from '../../../../../../serverless/src/util/cmr/pageAllCmrResults'

const COLOR_PARTITIONS = new Array(6)

/**
 * The heatmap has to be an array of exactly 5 arrays, 1 for each color in the
 * frequency scale for holding granules that belong to that color's
 * category
 */
const HEATMAP: GranuleMetadata[][] = Array.from({ length: 5 }, () => new Array(0))

/**
 * Returns the corrct position in the heatmap Arrays to place a granule
 */
function placeGranule(granule) {
  const granuleStart = Date.parse(granule.umm.TemporalExtent.RangeDateTime.BeginningDateTime)
  let insertLocation = 0
  for (let i = 0; i < COLOR_PARTITIONS.length; i += 1) {
    if (granuleStart < COLOR_PARTITIONS[i]) {
      insertLocation = i - 1
      break // Get out of the loop because we found the insert location
    }
  }

  if (insertLocation < 0) {
    HEATMAP[0].push(granule)
  } else if (granuleStart >= COLOR_PARTITIONS[COLOR_PARTITIONS.length - 1]) {
    HEATMAP[HEATMAP.length - 1].push(granule)
  } else {
    HEATMAP[insertLocation].push(granule)
  }
}

function processNthDimArray(array) {
  // Protect against arrays of length 0
  if (!array || array.length === 0) return

  // We have reached the lowest dimension, so insert all granules
  if (!Array.isArray(array[0])) {
    for (let i = 0; i < array.length; i += 1) {
      placeGranule(array[i])
    }
  // Go to the next array dimension
  } else {
    for (let i = 0; i < array.length; i += 1) {
      processNthDimArray(array[i])
    }
  }
}

/**
 * Create an array that stores all granules within the index that
 * represents their color category
 * 0 = Blue = low frequency
 * ...
 * 5 = Orange = high frequency
 */
function constructHeatmap(granules) {
  // Loop through all granules and insert them into their proper categories
  processNthDimArray(granules)
}

/**
 * Create the color scale for this collection
 * Color scale will have 5 colors:
 * Blue = low frequency
 * Light Blue
 * White
 * Light Orange
 * Orange = high frequency
 */
function createFrequencyScale(collectionStart: number, collectionEnd: number) {
  // Calculate the partition size for this collection
  const partitionSize = Math.ceil((collectionEnd - collectionStart) / 5.0)

  // Assign the partition values
  let indexCounter = 0
  for (let i = collectionStart; i < collectionEnd + partitionSize; i += partitionSize) {
    COLOR_PARTITIONS[indexCounter] = i
    indexCounter += 1
  }
}

/**
 * Test data conversion from granule measurement frequency to heatmap color
 */
async function spatialToHeatmap() {
  try {
    // Get the auth values
    const edlToken = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImJtc3VsdHplIiwiZXhwIjoxNzgwMjMxMjQ4LCJpYXQiOjE3NzUwNDcyNDgsImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsIiwiYWNyIjoiZWRsX21mYSIsImFzc3VyYW5jZV9sZXZlbCI6NH0.pSJdFCVJQwPRNXRVIYHiQUWQPjJGnTTuXauent29qp4i2W7OejNkPzntuE8rCuEvKLcW7rqL20VJDjihhv4hg5XWsKOGHyKHurq8U8Iv-_QMRa8CkE25Ttipmgioap4zkOEObnGmFqDIQ32ILnOEVSiCLtGxjP47OYtsEChtgOopuag_TKaWGv-Mm7HoGxTdNE6F_pvgzDl6jX-oA04gi3R8dJ2XBkDqV69KJNu5VlqPHc0d5bAX1tnXgqUFPY77fqm98O2BgMlGQfeNGHmfVneAXceoB05QgWjBGlTSEchvkMjAAqvpMMJMCIxCYqYiK0DzR2PBzmSBl8Tfa88pig'
    const earthdataEnvironment = 'test'
    const baseUrl = 'https://cmr.earthdata.nasa.gov'
    const granulesUrl = 'search/granules.umm_json'
    const collectionUrl = '/search/collections.umm_json'

    if (edlToken) {
      // Create a request object
      const requestObj = new Request(baseUrl, earthdataEnvironment)

      const params = {
        conceptId: 'C3993465598-NSIDC_CPRD'
      }
      const collectionResults = await requestObj.get(collectionUrl, params)

      // Get the collections start and end time
      const collectionStart = Date.parse(collectionResults.data.items[0]
                                          .umm
                                          .TemporalExtents[0]
                                          .RangeDateTimes[0]
                                          .BeginningDateTime)
      const collectionEnd = Date.parse(collectionResults.data.items[0]
                                          .umm
                                          .TemporalExtents[0]
                                          .RangeDateTimes[0]
                                          .EndingDateTime)

      // Create the frequency scale
      createFrequencyScale(collectionStart, collectionEnd)

      // Get the granules and build the heatmap
      const granules = await pageAllCmrResults({
        cmrToken: edlToken,
        deployedEnvironment: earthdataEnvironment,
        path: granulesUrl,
        queryParams: params
      })
      constructHeatmap(granules)
      console.log(HEATMAP)
    }
  } catch (e) {
    console.log(`Something went wrong fetching the test data: ${e}`)
  }
}

/**
 * Add the spatialToHeatmap function to the window object for testing
 */
window.addEventListener('load', () => {
  Object.assign(window, { runSpatialToHeatmap: spatialToHeatmap })
})

export default {
  spatialToHeatmap,
  COLOR_PARTITIONS,
  HEATMAP
}
