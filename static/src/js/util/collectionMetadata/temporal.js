import {
  castArray,
  flattenDeep,
  isPlainObject
} from 'lodash-es'

// Returns the date in YYYY-MM-DD format by splitting an ISO string
export const getDaysFromIsoDate = (date = '') => {
  if (date !== '') {
    return date.split('T')[0]
  }

  return ''
}

// Returns a date string for each temporal entry
export const parseTemporal = (metadata) => {
  const {
    endsAtPresentFlag,
    rangeDateTimes,
    singleDateTimes
  } = metadata

  // If there is a singleDateTime in the metadata utilize that date
  if (singleDateTimes) {
    return singleDateTimes.map((dateTime) => {
      const date = getDaysFromIsoDate(dateTime)

      return endsAtPresentFlag ? `${date} to Present` : date
    })
  }

  // Parse the temporal extents for the collection
  if (Array.isArray(rangeDateTimes)) {
    return rangeDateTimes.map((range) => castArray(range).map(
      (entry) => {
        const beginningDateTime = getDaysFromIsoDate(entry.beginningDateTime)
        const endingDateTime = getDaysFromIsoDate(entry.endingDateTime)

        // If the ends at present flag is set we still need to check each temporal extent individually
        if (endsAtPresentFlag && endingDateTime.length > 0) {
          return `${beginningDateTime} to ${endingDateTime}`
        }

        // If the ending date time is empty, we know that this is an ongoing dataset
        if (endsAtPresentFlag || endingDateTime === '') {
          return `${beginningDateTime} to Present`
        }

        // Otherwise, we know that this is a range
        return `${beginningDateTime} to ${endingDateTime}`
      }
    ))
  }

  // If its neither a SingleDateTime or rangeDateTimes is not set, the
  // entry is not valid and we return "Not available"
  return 'Not available'
}

// Returns an array of temporal extent entries
export const buildTemporal = (json) => {
  const { temporalExtents } = json

  // If temporalMetadata is neither an object or array, return 'Not available'
  if (!isPlainObject(temporalExtents) && !Array.isArray(temporalExtents)) return ['Not available']

  // Otherwise, parse the temporal information. If temporal is an object, castArray will wrap it
  // in an array to be mapped. We flattenDeep to make sure all temporal entries are on the top level of
  // the returned object
  return flattenDeep(castArray(temporalExtents).map((entry) => parseTemporal(entry)))
}
