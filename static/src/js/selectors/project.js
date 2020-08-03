import { createSelector } from 'reselect'

import { calculateOrderCount } from '../util/orderCount'
import { getCollectionsMetadata } from './collectionMetadata'
import { getFocusedCollectionId } from './focusedCollection'

export const getProjectCollectionsIds = (state) => {
  const { project = {} } = state
  const { collections = {} } = project
  const { allIds = [] } = collections

  return allIds
}

export const getProjectCollections = (state) => {
  const { project = {} } = state
  const { collections = {} } = project
  const { byId = {} } = collections

  return byId
}

export const getProjectCollectionsMetadata = createSelector(
  [getProjectCollectionsIds, getCollectionsMetadata],
  (projectCollectionsIds, collectionsMetadata) => Object.keys(collectionsMetadata)
    .filter(key => projectCollectionsIds.includes(key))
    .reduce((obj, key) => ({
      ...obj,
      [key]: collectionsMetadata[key]
    }), {})
)

export const getFocusedProjectCollection = createSelector(
  [getFocusedCollectionId, getProjectCollections],
  (focusedCollectionId, projectCollections) => {
    const { [focusedCollectionId]: focusedProjectCollection = {} } = projectCollections

    return focusedProjectCollection
  }
)

export const getProjectCollectionsRequiringChunking = createSelector(
  [getProjectCollections],
  projectCollections => Object.keys(projectCollections)
    .filter((key) => {
      const { [key]: projectCollection } = projectCollections

      return calculateOrderCount(projectCollection) > 0
    })
    .reduce((obj, key) => ({
      ...obj,
      [key]: projectCollections[key]
    }), {})
)
