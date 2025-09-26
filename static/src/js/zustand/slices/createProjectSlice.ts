import { AxiosError, isCancel } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { intersection, isEmpty } from 'lodash-es'
// @ts-expect-error This file does not have types
import { mbr } from '@edsc/geo-utils'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import configureStore from '../../store/configureStore'

// @ts-expect-error This file does not have types
import { getUsername } from '../../selectors/user'

// @ts-expect-error This file does not have types
import actions from '../../actions'

// @ts-expect-error This file does not have types
import { buildAccessMethods } from '../../util/accessMethods/buildAccessMethods'
// @ts-expect-error This file does not have types
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'
// @ts-expect-error This file does not have types
import { buildPromise } from '../../util/buildPromise'

import {
  createFocusedCollectionMetadata,
  getCollectionMetadata
  // @ts-expect-error This file does not have types
} from '../../util/focusedCollection'

// @ts-expect-error This file does not have types
import { getOpenSearchOsddLink } from '../../../../../sharedUtils/getOpenSearchOsddLink'
// @ts-expect-error This file does not have types
import { insertSavedAccessConfig } from '../../util/accessMethods/insertSavedAccessConfig'
// @ts-expect-error This file does not have types
import { isCSDACollection } from '../../util/isCSDACollection'
// @ts-expect-error This file does not have types
import { retrieveVariablesRequest } from '../../util/retrieveVariablesRequest'

import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractProjectCollectionGranuleParams
  // @ts-expect-error This file does not have types
} from '../../util/granules'

// @ts-expect-error This file does not have types
import GranuleRequest from '../../util/request/granuleRequest'
// @ts-expect-error This file does not have types
import OpenSearchGranuleRequest from '../../util/request/openSearchGranuleRequest'
// @ts-expect-error This file does not have types
import GraphQlRequest from '../../util/request/graphQlRequest'
import SavedAccessConfigsRequest from '../../util/request/savedAccessConfigsRequest'

import getProjectCollections from '../../operations/queries/getProjectCollections'

import type {
  ProjectSlice,
  ImmerStateCreator,
  ProjectGranuleResults,
  ProjectGranules,
  AccessMethodTypes
} from '../types'

import type {
  CollectionMetadata,
  GranuleResponseData,
  GranulesMetadata,
  Response,
  SavedAccessConfigs
} from '../../types/sharedTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getProjectCollectionsIds } from '../selectors/project'
import { getCollectionsMetadata } from '../selectors/collection'

const processResults = (results: ProjectGranuleResults['results']) => {
  const allIds: ProjectGranules['allIds'] = []
  const byId: ProjectGranules['byId'] = {}

  results.forEach((result) => {
    const { id } = result

    allIds.push(id)
    byId[id] = camelcaseKeys(result)
  })

  return {
    allIds,
    byId
  }
}

export const initialState = {
  collections: {
    allIds: [],
    byId: {}
  },
  isSubmitted: false,
  isSubmitting: false
}

export const initialGranuleState = {
  addedGranuleIds: [],
  allIds: [],
  byId: {},
  count: 0,
  isErrored: false,
  isLoaded: false,
  isLoading: false,
  isOpenSearch: false,
  singleGranuleSize: 0,
  loadTime: null,
  params: {
    pageNum: 1
  },
  timerStart: null,
  removedGranuleIds: []
}

const createProjectSlice: ImmerStateCreator<ProjectSlice> = (set, get) => ({
  project: {
    ...initialState,

    addGranuleToProjectCollection: ({ collectionId, granuleId }) => {
      // If the current collection is not in the project, add it
      if (!get().project.collections.allIds.includes(collectionId)) {
        set((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: initialGranuleState,
            isVisible: true
          }
        })
      }

      // Add the granule to the collection

      const projectCollection = get().project.collections.byId[collectionId]
      const { granules: projectCollectionGranules } = projectCollection

      const {
        addedGranuleIds = [],
        removedGranuleIds = []
      } = projectCollectionGranules

      // If there are no added granules, a user is trying to remove a granule from
      // a collection in their project.
      const removedGranuleIdIndex = removedGranuleIds.indexOf(granuleId)
      const addedGranuleIdIndex = addedGranuleIds.indexOf(granuleId)

      // If the granule is in the removed granules, remove it from the removed granules
      if (removedGranuleIdIndex > -1) {
        set((state) => {
          state.project.collections.byId[collectionId].granules.removedGranuleIds.splice(
            removedGranuleIdIndex,
            1
          )
        })
      } else if (addedGranuleIdIndex === -1 && removedGranuleIdIndex === -1) {
        // If the granule is not an added granule
        set((state) => {
          state.project.collections.byId[collectionId].granules.addedGranuleIds.push(granuleId)
        })
      }

      // Update project granule params
      get().project.updateProjectGranuleParams({
        collectionId,
        pageNum: 1
      })
    },

    addProjectCollection: (collectionId) => {
      if (!get().project.collections.allIds.includes(collectionId)) {
        set((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: initialGranuleState,
            isVisible: true
          }
        })

        get().project.getProjectGranules()
      }
    },

    erroredProjectGranules: (collectionId) => set((state) => {
      const { collections } = state.project
      const { byId } = collections
      const collection = byId[collectionId]

      if (collection) {
        collection.granules.isErrored = true
      }
    }),

    getProjectCollections: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken
      } = reduxState
      // If the user isn't logged in, return null
      if (!authToken) return null
      const username = getUsername(reduxState)

      const currentState = get()
      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const collectionsMetadata = getCollectionsMetadata(currentState)

      const {
        defaultCmrSearchTags,
        maxCmrPageSize: stringMaxCmrPageSize
      } = getApplicationConfig()

      const maxCmrPageSize = parseInt(stringMaxCmrPageSize, 10)

      const emptyProjectCollectionIds: string[] = []

      const { collections: projectCollections } = get().project
      const { allIds } = projectCollections

      // Determine which collections are in the project that we have no metadata for
      allIds.forEach((projectCollectionId) => {
        const { [projectCollectionId]: collectionMetadata = {} } = collectionsMetadata

        // If any of the metadata is missing push this collection to our array to fetch metadata for
        if (isEmpty(collectionMetadata)) {
          emptyProjectCollectionIds.push(projectCollectionId)
        }
      })

      // Default filteredIds to the provided collectionId
      let filteredIds = allIds

      // If no collectionId was provided
      if (allIds == null) {
        // Prepare to retrieve all collections that we have not already retrieved
        filteredIds = intersection(emptyProjectCollectionIds, allIds)
      }

      // If no collection was provided and the project has no collections return null
      if (filteredIds.length === 0) {
        return buildPromise(null)
      }

      // Fetch the saved access configurations for the project collections
      let savedAccessConfigs = {} as SavedAccessConfigs
      try {
        const savedAccessConfigsRequestObject = new SavedAccessConfigsRequest(
          authToken,
          earthdataEnvironment
        )

        const savedAccessConfigsResponse = await savedAccessConfigsRequestObject.search(
          { collectionIds: filteredIds }
        )

        const { data } = savedAccessConfigsResponse
        savedAccessConfigs = data
      } catch (error) {
        reduxDispatch(actions.handleError({
          error,
          action: 'getProjectCollections',
          resource: 'saved access configurations'
        }))

        // If we know that the user is unauthorized and we need to redirect to EDL, stop here.
        if (error instanceof AxiosError && error.response?.status === 401) {
          return buildPromise(null)
        }
      }

      const collectionParams = prepareCollectionParams(reduxState)

      const searchParams = buildCollectionSearchParams(collectionParams)

      const {
        includeHasGranules
      } = searchParams

      const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

      try {
        const response = await graphQlRequestObject.search(getProjectCollections, {
          params: {
            conceptId: filteredIds,
            includeTags: defaultCmrSearchTags.join(','),
            includeHasGranules,
            pageSize: filteredIds.length
          },
          subcriptionParams: {
            subscriberId: username
          },
          variableParams: {
            limit: maxCmrPageSize
          }
        })

        const {
          data: responseData
        } = response
        const { data } = responseData
        const { collections } = data
        const { items } = collections

        await Promise.all(items.map(async (metadata: CollectionMetadata) => {
          const {
            abstract,
            archiveAndDistributionInformation,
            associatedDois,
            boxes,
            cloudHosted,
            conceptId,
            coordinateSystem,
            dataCenter,
            dataCenters,
            dataQualitySummaries,
            duplicateCollections,
            granules,
            hasGranules,
            relatedCollections,
            services,
            shortName,
            subscriptions,
            tags,
            tilingIdentificationSystems,
            title,
            timeStart,
            timeEnd,
            tools,
            variables,
            versionId
          } = metadata

          if (variables && variables.count > maxCmrPageSize) {
            const retrievedItems = await retrieveVariablesRequest(
              variables,
              {
                params: {
                  conceptId,
                  includeHasGranules: false
                },
                variableParams: {
                  limit: maxCmrPageSize,
                  cursor: variables.cursor
                }
              },
              graphQlRequestObject
            )

            variables.items = retrievedItems

            if (variables.cursor) delete variables.cursor
          }

          const focusedMetadata = createFocusedCollectionMetadata(
            metadata,
            authToken,
            earthdataEnvironment
          )

          const isOpenSearch = !!getOpenSearchOsddLink(metadata)

          const collectionMetadata = {
            abstract,
            archiveAndDistributionInformation,
            associatedDois,
            boxes,
            cloudHosted,
            conceptId,
            coordinateSystem,
            dataQualitySummaries,
            dataCenter,
            duplicateCollections,
            granules,
            hasAllMetadata: true,
            hasGranules,
            id: conceptId,
            isCSDA: isCSDACollection(dataCenters),
            isOpenSearch,
            relatedCollections,
            services,
            shortName,
            subscriptions,
            tags,
            tilingIdentificationSystems,
            title,
            timeStart,
            timeEnd,
            tools,
            variables,
            versionId,
            ...focusedMetadata
          }

          const { [conceptId]: savedAccessConfig } = savedAccessConfigs

          const accessMethods = buildAccessMethods(metadata, isOpenSearch)

          const accessMethodsObject = insertSavedAccessConfig(
            accessMethods,
            savedAccessConfig
          )

          const { methods = {} } = accessMethodsObject
          let { selectedAccessMethod } = accessMethodsObject

          if (Object.keys(methods).length === 1 && !selectedAccessMethod) {
            const [firstAccessMethod] = Object.keys(methods)
            selectedAccessMethod = firstAccessMethod
          }

          // Set the access methods
          set((state) => {
            const collection = state.project.collections.byId[conceptId]
            const existingAccessMethods = collection?.accessMethods || {}

            Object.keys(methods).forEach((key) => {
              existingAccessMethods[key] = {
                ...methods[key],
                ...existingAccessMethods[key]
              }
            })

            const newCollection = {
              ...(collection || {}),
              accessMethods: existingAccessMethods
            }

            if (selectedAccessMethod) {
              newCollection.selectedAccessMethod = selectedAccessMethod
            }

            state.project.collections.byId[conceptId] = {
              ...collection,
              ...newCollection
            }
          })

          if (dataQualitySummaries) {
            const { items: dqsItems = [] } = dataQualitySummaries
            if (dqsItems && dqsItems.length > 0) {
              get().dataQualitySummaries.setDataQualitySummaries(conceptId, dqsItems)
            }
          }

          // Update metadata in the store
          set((state) => {
            state.collection.collectionMetadata[conceptId] = collectionMetadata
          })

          return response
        }))
      } catch (error) {
        reduxDispatch(actions.handleError({
          error,
          action: 'getProjectCollections',
          resource: 'project collections',
          showAlertButton: true,
          title: 'Something went wrong fetching collection metadata'
        }))
      }

      return null
    },

    getProjectGranules: async () => {
      const { defaultCmrPageSize, maxCmrPageSize } = getApplicationConfig()

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken
      } = reduxState

      const currentState = get()
      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const collectionsMetadata = getCollectionsMetadata(currentState)
      const projectCollectionIds = getProjectCollectionsIds(currentState)

      await Promise.all(projectCollectionIds.map((collectionId) => {
        // Extract granule search parameters from redux specific to this project collection
        const extractedGranuleParams = extractProjectCollectionGranuleParams(collectionId)

        // Fetch the collection metadata for this project collection
        const collectionMetadata = getCollectionMetadata(collectionId, collectionsMetadata)

        // Format and structure data to be sent to CMR
        const granuleParams = prepareGranuleParams(
          collectionMetadata,
          extractedGranuleParams
        )

        const {
          isOpenSearch
        } = granuleParams

        get().project.startProjectGranulesTimer(collectionId)

        reduxDispatch(actions.toggleSpatialPolygonWarning(false))

        const searchParams = buildGranuleSearchParams(granuleParams)

        let requestObject = null

        // TODO can I replace this with a single page of fetchGranuleLinks?
        if (isOpenSearch) {
          requestObject = new OpenSearchGranuleRequest(
            authToken,
            earthdataEnvironment,
            collectionId
          )

          // Provide the correctly named collection id parameter
          searchParams.echoCollectionId = collectionId

          const { polygon } = searchParams

          // CWIC does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
          if (polygon && polygon.length > 0) {
            reduxDispatch(actions.toggleSpatialPolygonWarning(true))

            const {
              swLat,
              swLng,
              neLat,
              neLng
            } = mbr({ polygon: polygon[0] })

            // Construct a string with points in the order expected by OpenSearch
            searchParams.boundingBox = [swLng, swLat, neLng, neLat].join(',')

            // Remove the unsupported polygon parameter
            delete searchParams.polygon
          }
        } else {
          requestObject = new GranuleRequest(authToken, earthdataEnvironment)
        }

        const { conceptId: granuleConceptIds = [] } = searchParams
        let pageSize = defaultCmrPageSize
        if (granuleConceptIds.length > 0) {
          if (granuleConceptIds.length > maxCmrPageSize) {
            reduxDispatch(actions.handleAlert({
              action: 'getProjectGranules',
              message: `User requested more than ${maxCmrPageSize} granules. Requested ${granuleConceptIds.length} granules.`,
              resource: 'granules',
              requestObject
            }))
          }

          pageSize = Math.min(maxCmrPageSize, granuleConceptIds.length)
        }

        searchParams.pageSize = pageSize

        const response = requestObject.search(searchParams)
          .then((responseObject: Response) => {
            const payload = populateGranuleResults({
              collectionId,
              isOpenSearch,
              response: responseObject
            })

            get().project.stopProjectGranulesTimer(collectionId)

            const { data } = responseObject
            const { feed } = data as GranuleResponseData
            const { entry } = feed

            const granules = {} as GranulesMetadata

            entry.forEach((granule) => {
              granules[granule.id] = granule
            })

            get().project.updateProjectGranuleResults({
              ...payload,
              pageNum: searchParams.pageNum
            })
          })
          .catch((error: Error) => {
            if (isCancel(error)) return

            get().project.erroredProjectGranules(collectionId)

            get().project.stopProjectGranulesTimer(collectionId)

            reduxDispatch(actions.handleError({
              error,
              action: 'getProjectGranules',
              resource: 'granules',
              requestObject,
              showAlertButton: true,
              title: 'Something went wrong fetching granule metadata'
            }))
          })

        return response
      }))
    },

    removeGranuleFromProjectCollection: ({ collectionId, granuleId }) => {
      const projectCollection = get().project.collections.byId[collectionId]
      const { granules: projectCollectionGranules } = projectCollection

      const {
        addedGranuleIds = [],
        count: granuleCount,
        removedGranuleIds = []
      } = projectCollectionGranules

      const addedGranuleIdIndex = addedGranuleIds.indexOf(granuleId)
      const removedGranuleIdIndex = removedGranuleIds.indexOf(granuleId)

      // If the granule is the last granule in the added granules array or the granule count is 1
      if (
        (addedGranuleIdIndex === 0 && addedGranuleIds.length === 1)
        || granuleCount === 1
      ) {
        // Remove the collection from the project
        get().project.removeProjectCollection(collectionId)
      } else {
        // If the granule is an added granule, remove it from the added granules
        if (addedGranuleIdIndex > -1) {
          set((state) => {
            state.project.collections.byId[collectionId].granules.addedGranuleIds.splice(
              addedGranuleIdIndex,
              1
            )
          })
        } else if (removedGranuleIdIndex === -1) {
          // If the granule is not in the removed granules, add it to the removed
          // granules array
          set((state) => {
            state.project.collections.byId[collectionId].granules.removedGranuleIds.push(granuleId)
          })
        }

        // Updates the project collection granule query resetting the page number
        // to one for the subsequent request
        get().project.updateProjectGranuleParams({
          collectionId,
          pageNum: 1
        })
      }
    },

    removeProjectCollection: (collectionId) => set((state) => {
      const { collections } = state.project

      if (collections.allIds.includes(collectionId)) {
        collections.allIds = collections.allIds.filter((id) => id !== collectionId)
        delete collections.byId[collectionId]
      }
    }),

    selectAccessMethod: ({ collectionId, selectedAccessMethod }) => set((state) => {
      const { collections } = state.project
      const { byId } = collections
      const collection = byId[collectionId]

      if (collection) {
        collection.selectedAccessMethod = selectedAccessMethod
      }
    }),

    startProjectGranulesTimer: (collectionId) => set((state) => {
      const { collections } = state.project
      const { byId } = collections
      const collection = byId[collectionId]

      if (collection) {
        collection.granules.timerStart = Date.now()
        collection.granules.isErrored = false
        collection.granules.isLoaded = false
        collection.granules.isLoading = true
      }
    }),

    stopProjectGranulesTimer: (collectionId) => set((state) => {
      const { collections } = state.project
      const { allIds, byId } = collections

      // In the event that a collection (or the last granule added for a collection)
      // is removed before this action is concluded, we want to ensure we're not adding
      // unwanted state. If the collection isn't in `allIds` return the current
      // state effectivly ignoring this abandoned request
      if (!allIds.includes(collectionId)) return

      const collection = byId[collectionId]
      const startTime = collection?.granules?.timerStart

      if (collection) {
        collection.granules.timerStart = null
        collection.granules.loadTime = startTime ? Date.now() - startTime : 0
        collection.granules.isLoading = false
        collection.granules.isLoaded = true
      }
    }),

    submittingProject: () => set((state) => {
      state.project.isSubmitted = false
      state.project.isSubmitting = true
    }),

    submittedProject: () => set((state) => {
      state.project.isSubmitted = true
      state.project.isSubmitting = false
    }),

    toggleCollectionVisibility: (collectionId) => set((state) => {
      const { collections } = state.project
      const { byId } = collections
      const collection = byId[collectionId]

      if (collection) {
        collection.isVisible = !collection.isVisible
      }
    }),

    updateAccessMethod: ({ collectionId, method }) => {
      const [methodKey] = Object.keys(method)
      const newMethod = method[methodKey]

      set((state) => {
        const { collections } = state.project
        const { byId } = collections
        const collection = byId[collectionId]

        const oldMethod = collection?.accessMethods?.[methodKey]

        if (!collection?.accessMethods || !oldMethod) return

        if (collection) {
          collection.accessMethods = {
            ...collection.accessMethods,
            [methodKey]: {
              ...(oldMethod as AccessMethodTypes),
              ...(newMethod as AccessMethodTypes)
            }
          }
        }
      })
    },

    updateProjectGranuleParams: ({ collectionId, pageNum }) => {
      const projectCollection = get().project.collections.byId[collectionId]
      if (!projectCollection) return

      set((state) => {
        state.project.collections.byId[collectionId].granules.params = {
          pageNum
        }
      })

      // Request granules with the updated parameters
      get().project.getProjectGranules()
    },

    updateProjectGranuleResults: ({
      collectionId,
      count,
      isOpenSearch,
      pageNum = 1,
      results,
      singleGranuleSize,
      totalSize
    }) => {
      const {
        allIds,
        byId
      } = processResults(results)

      const { collections: projectCollections } = get().project
      const {
        allIds: projectCollectionsIds,
        byId: projectCollectionsById = {}
      } = projectCollections

      // In the event that a collection (or the last granule added for a collection)
      // is removed before this action is concluded, we want to ensure we're not adding
      // unwanted state. If the collection isn't in `allIds` return the current
      // state effectively ignoring this abandoned request
      if (projectCollectionsIds.indexOf(collectionId) === -1) return

      const { [collectionId]: projectCollection } = projectCollectionsById
      const { granules: projectCollectionGranules } = projectCollection

      let {
        allIds: previousAllIds = [],
        byId: previousById = {}
      } = projectCollectionGranules

      if (pageNum === 1) {
        // If this is the first page of results, reset the granules state
        previousAllIds = []
        previousById = {}
      }

      set((state) => {
        state.project.collections.byId[collectionId].granules = {
          ...projectCollectionGranules,
          allIds: [
            ...previousAllIds,
            ...allIds
          ],
          byId: {
            ...previousById,
            ...byId
          },
          count,
          isOpenSearch,
          totalSize,
          singleGranuleSize
        }
      })
    }
  }
})

export default createProjectSlice
