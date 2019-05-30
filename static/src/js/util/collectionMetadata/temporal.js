import { castArray, flattenDeep, isPlainObject } from 'lodash'

// Returns the date in YYYY-MM-DD format by splitting an ISO string
export const getDaysFromIsoDate = (date = '') => {
  if (date !== '') {
    return date.split('T')[0]
  }
  return ''
}

// Returns a date string for each temporal entry
export const parseTemporal = (metadata, temporal) => {
  const type = metadata.TemporalRangeType
  const endsAtPresentFlag = metadata.EndsAtPresentFlag

  // Single date times are found on the SingleDateTime key
  if (type === 'SingleDateTime') {
    const date = getDaysFromIsoDate(temporal.SingleDateTime)
    return endsAtPresentFlag ? `${date} ongoing` : date
  }

  // If were not dealing with a SingleDateTime, we're dealing with
  // the metadata should have RangeDateTimes
  if (Array.isArray(metadata.RangeDateTimes)) {
    return metadata.RangeDateTimes.map(range => castArray(range).map(
      (entry) => {
        const beginningDateTime = getDaysFromIsoDate(entry.BeginningDateTime)
        const endingDateTime = getDaysFromIsoDate(entry.EndingDateTime)

        // If endsAtPresentFlag is set, or endingDate time is missing, we know this is
        // an 'ongoing' date
        if (endsAtPresentFlag || endingDateTime === '') {
          return `${beginningDateTime} ongoing`
        }

        // Otherwise, we know that this is a range
        return `${beginningDateTime} to ${endingDateTime}`
      }
    ))
  }

  // If its neither a SingleDateTime or RangeDateTimes is not set, the
  // entry is not valid and we return "Not available"
  return 'Not available'
}

// Returns an array of temporal extent entries
export const buildTemporal = (ummJson) => {
  const temporal = ummJson.TemporalExtents
  // If temporalMetadata is neither an object or array, return 'Not available'
  if (!isPlainObject(temporal) && !Array.isArray(temporal)) return ['Not available']

  // Otherwise, parse the temporal information. If temporal is an object, castArray will wrap it
  // in an array to be mapped. We flattenDeep to make sure all temporal entries are on the top level of
  // the returned object
  return flattenDeep(castArray(temporal).map(entry => parseTemporal(entry)))
}
