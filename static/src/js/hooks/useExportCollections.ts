import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { isEmpty } from 'lodash-es'

import EXPORT_COLLECTIONS from '../operations/queries/exportCollections'

import useEdscStore from '../zustand/useEdscStore'

// @ts-expect-error There are no types for this file
import configureStore from '../store/configureStore'

// @ts-expect-error This file does not have types
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { jsonToCsv } from '../util/export/jsonToCsv'

import { apolloClientNames } from '../constants/apolloClientNames'

// @ts-expect-error This file does not have types
import { constructDownloadableFile } from '../util/files/constructDownloadableFile'

import type { CollectionMetadata } from '../types/sharedTypes'

/**
 * Custom hook to export the collection search results.
 */
export const useExportCollections = () => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')

  // The collection parameters used in the export query
  const [exportParams, setExportParams] = useState({})

  const [loading, setLoading] = useState<boolean>(false)

  const [collections, setCollections] = useState<CollectionMetadata[]>([])

  const handleError = useEdscStore((state) => state.errors.handleError)

  const [doExportCollections, {
    data = {},
    error
  }] = useLazyQuery(EXPORT_COLLECTIONS, {
    fetchPolicy: 'no-cache',
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    }
  })

  // Handle errors from the export collections query
  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'exportSearch',
        resource: 'collections',
        showAlertButton: true,
        title: 'Something went wrong exporting your search'
      })
    }
  }, [error])

  // This useEffect is triggered when the `data` from the query is returned
  useEffect(() => {
    // If there is no `data`, return early. (`data` is reset when the next request starts)
    if (isEmpty(data)) return

    const { collections: collectionsData = {} } = data
    const {
      cursor,
      items = []
    } = collectionsData || {}

    // If there are items in the current page, add them to the collections state and fetch the next page
    if (items.length > 0) {
      setCollections((previousCollections) => [
        ...previousCollections,
        ...items
      ])

      // Fetch the next page of collections
      doExportCollections({
        variables: {
          params: {
            ...exportParams,
            cursor
          }
        }
      })
    } else {
      // No more items to fetch, finish the export
      setLoading(false)

      // Format the data
      let fileContents = null

      if (exportFormat === 'json') fileContents = JSON.stringify(collections)
      if (exportFormat === 'csv') fileContents = jsonToCsv(collections)

      // Download the file
      constructDownloadableFile(
        fileContents,
        `edsc_collection_results_export.${exportFormat}`,
        exportFormat === 'csv' ? 'text/csv' : 'application/json'
      )
    }
  }, [data])

  const exportCollections = (type: 'csv' | 'json') => {
    // If there is already an export in progress, do not start a new one
    if (loading !== false) return

    // Set the loading to the current export type
    setLoading(true)

    // Set the export format so we remember which format is being exported
    setExportFormat(type)

    // Clear the current collections before starting a new export
    setCollections([])

    // Get the current Redux state
    const {
      getState: reduxGetState
    } = configureStore()
    const reduxState = reduxGetState()

    // Prepare the collection parameters for the export query
    const collectionParams = prepareCollectionParams(reduxState)

    // Build the search parameters for the export query
    const params = {
      ...buildCollectionSearchParams(collectionParams),
      limit: 1000,
      // These params include data that is not used in exporting collections. Setting them to undefined to remove the params
      includeFacets: undefined,
      includeGranuleCounts: undefined,
      includeTags: undefined,
      pageNum: undefined,
      pageSize: undefined
    }

    // Save the export parameters so they can be used in subsequent requests
    setExportParams(params)

    // Start the export query
    doExportCollections({
      variables: {
        params
      }
    })
  }

  return {
    exportCollections,
    exportFormat,
    exportLoading: loading
  }
}
