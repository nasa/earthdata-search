import { parseError } from '../../../../sharedUtils/parseError'

/**
 * Formats the metadata shown in the collection results
 * @param {Object} collections collections object from searchResults in the store
 * @param {Array} projectIds Array of collection ids that are added to the project
 * @param {Object} browser browser object from the store
 */
export const formatCollectionList = (collections, projectIds, browser) => {
  const { allIds: collectionIds } = collections

  return collectionIds.map((collectionId, index) => {
    const collection = collections.byId[collectionId]

    const {
      dataset_id: datasetId = null,
      granule_count: granuleCount = 0,
      has_formats: hasFormats = false,
      has_spatial_subsetting: hasSpatialSubsetting = false,
      has_temporal_subsetting: hasTemporalSubsetting = false,
      has_transforms: hasTransforms = false,
      has_variables: hasVariables = false,
      has_map_imagery: hasMapImagery = false,
      is_cwic: isCwic = false,
      is_nrt: isNrt = false,
      organizations = [],
      short_name: shortName,
      summary = '',
      thumbnail = null,
      time_end: timeEnd = null,
      time_start: timeStart = null,
      version_id: versionId
    } = collection

    const {
      name: browserName
    } = browser

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

          temporalRange = `${dateStart} ongoing`
          temporalStart = dateStart
          temporalEnd = 'ongoing'
        } catch (e) {
          parseError(e)
        }
      }

      if (timeEnd) {
        try {
          const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

          temporalRange = `Up to ${dateEnd}`
          temporalEnd = dateEnd
        } catch (e) {
          parseError(e)
        }
      }

      if (timeStart && timeEnd) {
        try {
          const dateStart = new Date(timeStart).toISOString().split('T')[0]
          const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

          temporalRange = `${dateStart} to ${dateEnd}`
        } catch (e) {
          parseError(e)
        }
      }
    }

    let description = summary
    if (browserName === 'ie') description = `${description.substring(0, 280)}...`

    const isCollectionInProject = projectIds.indexOf(collectionId) !== -1

    const isLast = index === collectionIds.length - 1

    return {
      collectionId,
      datasetId,
      description,
      displayOrganization,
      granuleCount,
      hasFormats,
      hasSpatialSubsetting,
      hasTemporalSubsetting,
      hasTransforms,
      hasVariables,
      hasMapImagery,
      isCwic,
      isNrt,
      shortName,
      temporalEnd,
      temporalRange,
      temporalStart,
      thumbnail,
      versionId,
      isCollectionInProject,
      isLast
    }
  })
}
