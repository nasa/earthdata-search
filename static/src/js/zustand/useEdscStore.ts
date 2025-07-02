import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EdscStore } from './types'

import createEarthdataDownloadRedirectSlice from './slices/createEarthdataDownloadRedirectSlice'
import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createPreferencesSlice from './slices/createPreferencesSlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'
import createPortalSlice from './slices/createPortalSlice'
import createFacetParamsSlice from './slices/createFacetParamsSlice'

const useEdscStore = create<EdscStore>()(
  immer(
    devtools(
      (...args) => ({
        ...createEarthdataDownloadRedirectSlice(...args),
        ...createFacetParamsSlice(...args),
        ...createHomeSlice(...args),
        ...createMapSlice(...args),
        ...createPortalSlice(...args),
        ...createPreferencesSlice(...args),
        ...createShapefileSlice(...args),
        ...createTimelineSlice(...args),
        ...createUiSlice(...args)
      }),
      {
        name: 'edsc-store'
      }
    )
  )
)

export default useEdscStore
