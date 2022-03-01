import { eventEmitter } from '../events/events'
import { createDataLinks, createS3Links } from './granules'

/**
 * @typedef {Object} GranuleListInfo
 * @property {Array} granulesList - An array of formatted granule info
 * @property {Boolean} hasBrowseImagery - Flag to detirmine if any of the granules have browse imagery defined
 */

/**
 * Formats granule results
 * @param {String} focusedGranuleId - The focused granule.
 * @param {Object} granules - The granules from the redux store.
 * @param {Array} granuleIds - Granule IDs to return in the list.
 * @param {Function} isGranuleInProject - Returns a boolean to designate if a granule is in the project.
 * @param {Boolean} isCollectionInProject - Boolean to designate if a collection is in the project.
 * @returns {GranuleListInfo} - The return object
 */
export const formatGranulesList = ({
  granuleIds,
  granulesMetadata,
  hoveredGranuleId,
  focusedGranuleId,
  isGranuleInProject,
  isCollectionInProject
}) => {
  let hasBrowseImagery = false

  const granulesList = granuleIds.map((granuleId) => {
    const granule = granulesMetadata[granuleId]

    const original = granule

    const isFocused = focusedGranuleId === granuleId

    const {
      browseFlag,
      browseUrl,
      collectionConceptId,
      dayNightFlag,
      formattedTemporal = [],
      id,
      isOpenSearch,
      links,
      onlineAccessFlag,
      producerGranuleId,
      thumbnail: granuleThumbnail,
      title
    } = granule

    if (browseFlag && !hasBrowseImagery) hasBrowseImagery = true

    const temporal = formattedTemporal
    const [timeStart, timeEnd] = temporal
    const thumbnail = browseFlag ? granuleThumbnail : false

    const dataLinks = createDataLinks(links)
    const s3Links = createS3Links(links)
    const isFocusedGranule = isFocused || focusedGranuleId === id
    const isHoveredGranule = hoveredGranuleId === id
    const isInProject = isGranuleInProject(id)

    const handleClick = () => {
      let stickyGranule = original
      if (id === focusedGranuleId) stickyGranule = null
      eventEmitter.emit(`map.layer.${collectionConceptId}.stickygranule`, { granule: stickyGranule })
    }

    const handleMouseEnter = () => {
      eventEmitter.emit(`map.layer.${collectionConceptId}.focusgranule`, { granule: original })
    }

    const handleMouseLeave = () => {
      eventEmitter.emit(`map.layer.${collectionConceptId}.focusgranule`, { granule: null })
    }

    return {
      browseFlag,
      browseUrl,
      dataLinks,
      dayNightFlag,
      formattedTemporal,
      granuleThumbnail,
      id,
      links,
      onlineAccessFlag,
      original,
      temporal,
      thumbnail,
      timeEnd,
      timeStart,
      // Use producerGranuleId as title, unless it doesn't exist (CWIC) then fallback to title
      title: producerGranuleId || title,
      isHoveredGranule,
      isFocusedGranule,
      isInProject,
      isCollectionInProject,
      isOpenSearch,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      s3Links
    }
  })

  return {
    granulesList,
    hasBrowseImagery
  }
}
