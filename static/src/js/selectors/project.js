import { createSelector } from 'reselect'

import { calculateOrderCount } from '../util/orderCount'
import { getCollectionsMetadata } from './collectionMetadata'
import { getFocusedCollectionId } from './focusedCollection'

/**
 * Retrieve all project collection ids from Redux
 * @param {Object} state Current state of Redux
 */
export const getProjectCollectionsIds = (state) => {
  const { project = {} } = state
  const { collections = {} } = project
  const { allIds = [] } = collections

  return allIds
}

/**
 * Retrieve all project collection information from Redux
 * @param {Object} state Current state of Redux
 */
export const getProjectCollections = (state) => {
  const { project = {} } = state
  const { collections = {} } = project
  const { byId = {} } = collections

  return byId
}

/**
 * Retrieve metadata from Redux pertaining to the collections that are currently in a project
 */
export const getProjectCollectionsMetadata = createSelector(
  [getProjectCollectionsIds, getCollectionsMetadata],
  (projectCollectionsIds, collectionsMetadata) => Object.keys(collectionsMetadata)
    .filter((key) => projectCollectionsIds.includes(key))
    .reduce((obj, key) => ({
      ...obj,
      [key]: collectionsMetadata[key]
    }), {})
)

/**
 * Retrieve project collection information from Redux pertaining to the focused collection id
 */
export const getFocusedProjectCollection = createSelector(
  [getFocusedCollectionId, getProjectCollections],
  (focusedCollectionId, projectCollections) => {
    const { [focusedCollectionId]: focusedProjectCollection = {} } = projectCollections

    return focusedProjectCollection
  }
)

/**
 * Retrieve project collection information from Redux for collections whose current configurations will result in multiple orders
 */
export const getProjectCollectionsRequiringChunking = createSelector(
  [getProjectCollections],
  (projectCollections) => Object.keys(projectCollections)
    .filter((key) => {
      const { [key]: projectCollection } = projectCollections

      return calculateOrderCount(projectCollection) > 1
    })
    .reduce((obj, key) => ({
      ...obj,
      [key]: projectCollections[key]
    }), {})
)
