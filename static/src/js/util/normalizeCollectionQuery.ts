import type { QuerySlice } from '../zustand/types'

type CollectionQuery = QuerySlice['query']['collection']

// Version is only selectable for one Short Name; clear stale values after query changes or URL restoration.
export const normalizeCollectionQuery = (query: CollectionQuery): CollectionQuery => ({
  ...query,
  version: query.shortName?.length === 1 ? query.version : undefined
})
