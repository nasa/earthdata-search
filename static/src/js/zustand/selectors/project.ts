import { EdscStore, ProjectCollections } from '../types'

// @ts-expect-error: This file does not have types
import { calculateOrderCount } from '../../util/orderCount'

// @ts-expect-error: This file does not have types
import configureStore from '../../store/configureStore'
// @ts-expect-error: This file does not have types
import { getCollectionsMetadata } from '../../selectors/collectionMetadata'
// @ts-expect-error: This file does not have types
import { getFocusedCollectionId } from '../../selectors/focusedCollection'

/**
 * Retrieve all project collection ids
 */
export const getProjectCollectionsIds = (
  state: EdscStore
): string[] => state.project.collections.allIds

/**
 * Retrieve all project collection information
 */
export const getProjectCollections = (
  state: EdscStore
): ProjectCollections['byId'] => state.project.collections.byId

/**
 * Retrieve metadata pertaining to the collections that are currently in a project
 */
export const getProjectCollectionsMetadata = (state: EdscStore) => {
  const projectCollectionsIds = getProjectCollectionsIds(state)

  const { getState: getReduxState } = configureStore()
  const collectionsMetadata = getCollectionsMetadata(getReduxState())

  return Object.keys(collectionsMetadata)
    .filter((key) => projectCollectionsIds.includes(key))
    .reduce((obj, key) => ({
      ...obj,
      [key]: collectionsMetadata[key]
    }), {})
}

/**
 * Retrieve project collection information pertaining to the focused collection id
 */
export const getFocusedProjectCollection = (state: EdscStore) => {
  const { getState: getReduxState } = configureStore()
  const focusedCollectionId = getFocusedCollectionId(getReduxState())
  const projectCollections = getProjectCollections(state)

  const { [focusedCollectionId]: focusedProjectCollection = {} } = projectCollections

  return focusedProjectCollection
}

/**
 * Retrieve project collection information for collections whose current configurations will result in multiple orders
 */
export const getProjectCollectionsRequiringChunking = (state: EdscStore) => {
  const projectCollections = getProjectCollections(state)

  return Object.keys(projectCollections)
    .filter((key) => {
      const { [key]: projectCollection } = projectCollections

      return calculateOrderCount(projectCollection) > 1
    })
    .reduce((obj, key) => ({
      ...obj,
      [key]: projectCollections[key]
    }), {})
}
