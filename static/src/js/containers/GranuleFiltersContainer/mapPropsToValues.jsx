export const mapPropsToValues = (props) => {
  const {
    granuleQuery
  } = props
  console.log('🚀 ~ file: mapPropsToValues.jsx:5 ~ mapPropsToValues ~ granuleQuery:', granuleQuery)

  const {
    browseOnly = false,
    cloudCover = {},
    dayNightFlag = '',
    equatorCrossingDate = {},
    equatorCrossingLongitude = {},
    gridCoords = '',
    onlineOnly = false,
    orbitNumber = {},
    readableGranuleName = '',
    temporal = {},
    tilingSystem = ''
  } = granuleQuery

  const {
    min: cloudCoverMin,
    max: cloudCoverMax
  } = cloudCover

  const {
    min: orbitNumberMin = '',
    max: orbitNumberMax = ''
  } = orbitNumber

  const {
    min: equatorCrossingLongitudeMin = '',
    max: equatorCrossingLongitudeMax = ''
  } = equatorCrossingLongitude

  const {
    startDate: equatorCrossingDateStart = '',
    endDate: equatorCrossingDateEnd = ''
  } = equatorCrossingDate

  const {
    startDate: temporalStartDate,
    endDate: temporalEndDate,
    recurringDayStart: temporalRecurringDayStart = '',
    recurringDayEnd: temporalRecurringDayEnd = '',
    isRecurring: temporalIsRecurring = false
  } = temporal

  return {
    gridCoords: gridCoords || '',
    tilingSystem: tilingSystem || '',
    dayNightFlag: dayNightFlag || '',
    browseOnly: browseOnly || false,
    onlineOnly: onlineOnly || false,
    cloudCover: {
      min: cloudCoverMin || '',
      max: cloudCoverMax || ''
    },
    orbitNumber: {
      min: orbitNumberMin || '',
      max: orbitNumberMax || ''
    },
    equatorCrossingLongitude: {
      min: equatorCrossingLongitudeMin || '',
      max: equatorCrossingLongitudeMax || ''
    },
    equatorCrossingDate: {
      startDate: equatorCrossingDateStart || '',
      endDate: equatorCrossingDateEnd || ''
    },
    temporal: {
      startDate: temporalStartDate || '',
      endDate: temporalEndDate || '',
      recurringDayStart: temporalRecurringDayStart || '',
      recurringDayEnd: temporalRecurringDayEnd || '',
      isRecurring: temporalIsRecurring || false
    },
    readableGranuleName: readableGranuleName || ''
  }
}

export default mapPropsToValues
