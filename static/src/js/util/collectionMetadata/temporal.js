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
  const type = metadata.temporal_range_type
  const endsAtPresentFlag = metadata.ends_at_present_flag

  // Single date times are found on the SingleDateTime key
  if (type === 'SingleDateTime') {
    const date = getDaysFromIsoDate(temporal.single_date_time)
    return endsAtPresentFlag ? `${date} ongoing` : date
  }

  // If were not dealing with a SingleDateTime, we're dealing with
  // the metadata should have range_date_times
  if (Array.isArray(metadata.range_date_times)) {
    return metadata.range_date_times.map(range => castArray(range).map(
      (entry) => {
        const beginningDateTime = getDaysFromIsoDate(entry.beginning_date_time)
        const endingDateTime = getDaysFromIsoDate(entry.ending_date_time)

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

  // If its neither a SingleDateTime or range_date_times is not set, the
  // entry is not valid and we return "Not available"
  return 'Not available'
}

// Returns an array of temporal extent entries
export const buildTemporal = (ummJson) => {
  const temporal = ummJson.temporal_extents
  // If temporalMetadata is neither an object or array, return 'Not available'
  if (!isPlainObject(temporal) && !Array.isArray(temporal)) return ['Not available']

  // Otherwise, parse the temporal information. If temporal is an object, castArray will wrap it
  // in an array to be mapped. We flattenDeep to make sure all temporal entries are on the top level of
  // the returned object
  return flattenDeep(castArray(temporal).map(entry => parseTemporal(entry)))
}
