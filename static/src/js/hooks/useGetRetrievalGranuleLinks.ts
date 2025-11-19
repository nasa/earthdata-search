import {
  useEffect,
  useRef,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import { isEmpty } from 'lodash-es'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../sharedUtils/config'

import GET_RETRIEVAL_GRANULE_LINKS from '../operations/queries/getRetrievalGranuleLinks'

import useEdscStore from '../zustand/useEdscStore'

import type { CollectionMetadata } from '../types/sharedTypes'

export type UseGetRetrievalGranuleLinksProps = {
  /** Metadata about the collection */
  collectionMetadata: CollectionMetadata
  /** The number of granules */
  granuleCount: number
  /** Types of links to fetch */
  linkTypes: Array<'data' | 's3' | 'browse'>
  /** The obfuscated ID of the retrieval */
  obfuscatedId: string
}

type GranuleLinks = {
  /** Browse links */
  browse: string[]
  /** Data links */
  data: string[]
  /** S3 links */
  s3: string[]
}

/**
 * Custom hook to fetch granule links for a retrieval.
 */
export const useGetRetrievalGranuleLinks = ({
  collectionMetadata,
  granuleCount,
  linkTypes,
  obfuscatedId
}: UseGetRetrievalGranuleLinksProps) => {
  const { granuleLinksPageSize, openSearchGranuleLinksPageSize } = getApplicationConfig()

  const handleError = useEdscStore((state) => state.errors.handleError)

  const [granuleLinks, setGranuleLinks] = useState<GranuleLinks>({
    browse: [],
    data: [],
    s3: []
  })

  // The percentage of granule links that have been fetched
  const [percentDone, setPercentDone] = useState<number>(0)

  // The current page of granule links being fetched, this is used to calculate the percent done
  const currentPageRef = useRef(1)

  // The number of granules to request per page from CMR
  let pageSize = parseInt(granuleLinksPageSize, 10)

  // Adjust the page size if the collection is an OpenSearch collection
  const { isOpenSearch } = collectionMetadata
  if (isOpenSearch) {
    pageSize = parseInt(openSearchGranuleLinksPageSize, 10)
  }

  // Determine how many pages we will need to load to display all granules
  const totalPages = Math.ceil(granuleCount / pageSize)

  const [fetchGranuleLinks, {
    data = {},
    error,
    loading
  }] = useLazyQuery(GET_RETRIEVAL_GRANULE_LINKS)

  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'getRetrievalGranuleLinks',
        resource: 'granule links'
      })
    }
  }, [error])

  // This useEffect is triggered when the `data` from the query is returned
  useEffect(() => {
    // If there is no `data`, return early. (`data` is reset when the next request starts)
    if (isEmpty(data)) return

    const { retrieveGranuleLinks = {} } = data || {}
    const {
      cursor,
      done,
      links = {}
    } = retrieveGranuleLinks

    const {
      browse = [],
      download = [],
      s3 = []
    } = links || {}

    const linksReturned = !isEmpty(browse) || !isEmpty(download) || !isEmpty(s3)

    // If the retrieval is not done and links were returned, save the links and fetch the next page
    if (!done && linksReturned) {
      // Update the percent done and current page
      setPercentDone((((currentPageRef.current) / totalPages) * 100))
      currentPageRef.current += 1

      // Save the links, keeping the previous values
      setGranuleLinks((previousLinks) => ({
        browse: [...previousLinks.browse, ...browse],
        data: [...previousLinks.data, ...download],
        s3: [...previousLinks.s3, ...s3]
      }))

      // Fetch the next page of granule links
      fetchGranuleLinks({
        variables: {
          cursor,
          obfuscatedRetrievalCollectionId: obfuscatedId,
          linkTypes,
          flattenLinks: false
        }
      })
    }
  }, [data])

  // On initial render, fetch the first page of granule links
  useEffect(() => {
    fetchGranuleLinks({
      variables: {
        cursor: null,
        obfuscatedRetrievalCollectionId: obfuscatedId,
        linkTypes,
        flattenLinks: false
      }
    })
  }, [])

  return {
    granuleLinks,
    loading: loading || percentDone < 100,
    percentDone: percentDone.toFixed()
  }
}
