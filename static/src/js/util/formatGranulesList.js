import { eventEmitter } from '../events/events'
import { createDataLinks } from './granules'

/**
 * @typedef {Object} GranuleListInfo
 * @property {Array} granulesList - An array of formatted granule info
 * @property {Boolean} hasBrowseImagery - Flag to detirmine if any of the granules have browse imagery defined
 */

/**
 * Formats granule results
 * @param {String} focusedGranule - The focused granule.
 * @param {Object} granules - The granules from the redux store.
 * @param {Array} granuleIds - Granule IDs to return in the list.
 * @param {Function} isGranuleInProject - Returns a boolean to designate if a granule is in the project.
 * @param {Boolean} isCollectionInProject - Boolean to designate if a collection is in the project.
 * @returns {GranuleListInfo} - The return object
 */
export const formatGranulesList = (
  granuleIds,
  granulesMetadata,
  focusedGranule,
  isGranuleInProject,
  isCollectionInProject
) => {
  let hasBrowseImagery = false

  const granulesList = granuleIds.map((granuleId) => {
    const granule = granulesMetadata[granuleId]

    const original = granule

    const isFocused = focusedGranule === granuleId

    const {
      browseFlag,
      browseUrl,
      collectionId,
      dayNightFlag,
      formattedTemporal,
      id,
      links,
      onlineAccessFlag,
      originalFormat,
      granuleThumbnail,
      title
    } = granule

    if (browseFlag && !hasBrowseImagery) hasBrowseImagery = true

    const temporal = formattedTemporal
    const [timeStart, timeEnd] = temporal
    const thumbnail = browseFlag ? granuleThumbnail : false

    const dataLinks = createDataLinks(links)
    const isFocusedGranule = isFocused || focusedGranule === id
    const isInProject = isGranuleInProject(id)

    const handleClick = () => {
      let stickyGranule = original
      if (id === focusedGranule) stickyGranule = null
      eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule: stickyGranule })
    }

    const handleMouseEnter = () => {
      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: original })
    }

    const handleMouseLeave = () => {
      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: null })
    }

    return {
      browseFlag,
      browseUrl,
      dataLinks,
      dayNightFlag,
      formattedTemporal,
      id,
      links,
      onlineAccessFlag,
      original,
      originalFormat,
      granuleThumbnail,
      title,
      temporal,
      timeStart,
      timeEnd,
      thumbnail,
      isFocusedGranule,
      isInProject,
      isCollectionInProject,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  })

  return {
    granulesList,
    hasBrowseImagery
  }
}
