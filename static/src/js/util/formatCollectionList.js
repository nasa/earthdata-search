import { parseError } from '../../../../sharedUtils/parseError'

/**
 * Formats the metadata shown in the collection results
 * @param {Object} collections collections object from searchResults in the store
 * @param {Array} projectIds Array of collection ids that are added to the project
 */
export const formatCollectionList = (
  collections,
  projectIds = []
) => collections.map((collection, index) => {
  const {
    cloudHosted = false,
    collectionDataType,
    id: collectionId,
    consortiums = [],
    datasetId = null,
    granuleCount = 0,
    hasMapImagery = false,
    isCSDA = false,
    isNrt = false,
    isOpenSearch = false,
    isDefaultImage = false,
    organizations = [],
    serviceFeatures = {},
    shortName,
    summary = '',
    thumbnail = null,
    timeEnd = null,
    timeStart = null,
    versionId
  } = collection

  let displayOrganization = ''

  if (organizations && organizations.length) {
    [displayOrganization] = organizations
  }

  let temporalRange = ''
  let temporalStart = ''
  let temporalEnd = ''

  if (timeStart || timeEnd) {
    if (timeStart) {
      try {
        const dateStart = new Date(timeStart).toISOString().split('T')[0]

        temporalRange = `${dateStart} to Present`
        temporalStart = dateStart
        temporalEnd = 'Present'
      } catch (error) {
        parseError(error)
      }
    }

    if (timeEnd) {
      try {
        const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

        temporalRange = `Up to ${dateEnd}`
        temporalEnd = dateEnd
      } catch (error) {
        parseError(error)
      }
    }

    if (timeStart && timeEnd) {
      try {
        const dateStart = new Date(timeStart).toISOString().split('T')[0]
        const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

        temporalRange = `${dateStart} to ${dateEnd}`
      } catch (error) {
        parseError(error)
      }
    }
  }

  const isCollectionInProject = projectIds.indexOf(collectionId) !== -1

  const isLast = index === collections.length - 1

  // Determine service feature flags
  let hasCombine = false
  let hasFormats = false
  let hasSpatialSubsetting = false
  let hasTemporalSubsetting = false
  let hasTransforms = false
  let hasVariables = false

  Object.keys(serviceFeatures).forEach((key) => {
    const service = serviceFeatures[key]

    const {
      hasCombine: serviceHasCombine,
      hasFormats: serviceHasFormats,
      hasSpatialSubsetting: serviceHasSpatialSubsetting,
      hasTemporalSubsetting: serviceHasTemporalSubsetting,
      hasTransforms: serviceHasTransforms,
      hasVariables: serviceHasVariables
    } = service

    if (serviceHasCombine) hasCombine = true
    if (serviceHasFormats) hasFormats = true
    if (serviceHasSpatialSubsetting) hasSpatialSubsetting = true
    if (serviceHasTemporalSubsetting) hasTemporalSubsetting = true
    if (serviceHasTransforms) hasTransforms = true
    if (serviceHasVariables) hasVariables = true
  })

  const nrtTypes = {
    NEAR_REAL_TIME: {
      label: '1 to 3 hours',
      description: 'Data is available 1 to 3 hours after being acquired by the instrument on the satellite'
    },
    LOW_LATENCY: {
      label: '3 to 24 hours',
      description: 'Data is available 3 to 24 hours after being acquired by the instrument on the satellite'
    },
    EXPEDITED: {
      label: '1 to 4 days',
      description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
    }
  }

  const { [collectionDataType]: nrt = {} } = nrtTypes

  return {
    cloudHosted,
    collectionDataType,
    collectionId,
    consortiums,
    datasetId,
    displayOrganization,
    granuleCount,
    hasCombine,
    hasFormats,
    hasMapImagery,
    hasSpatialSubsetting,
    hasTemporalSubsetting,
    hasTransforms,
    hasVariables,
    isCollectionInProject,
    isCSDA,
    isLast,
    isNrt,
    isOpenSearch,
    isDefaultImage,
    nrt,
    organizations,
    shortName,
    summary,
    temporalEnd,
    temporalRange,
    temporalStart,
    thumbnail,
    versionId
  }
})
