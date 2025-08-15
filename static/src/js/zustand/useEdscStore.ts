import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EdscStore } from './types'

import createDataQualitySummariesSlice from './slices/createDataQualitySummariesSlice'
import createEarthdataDownloadRedirectSlice from './slices/createEarthdataDownloadRedirectSlice'
import createEarthdataEnvironmentSlice from './slices/createEarthdataEnvironmentSlice'
import createFacetParamsSlice from './slices/createFacetParamsSlice'
import createFocusedCollectionSlice from './slices/createFocusedCollectionSlice'
import createFocusedGranuleSlice from './slices/createFocusedGranuleSlice'
import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createPortalSlice from './slices/createPortalSlice'
import createPreferencesSlice from './slices/createPreferencesSlice'
import createProjectSlice from './slices/createProjectSlice'
import createQuerySlice from './slices/createQuerySlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'
import createProjectPanelsSlice from './slices/createProjectPanelsSlice'

const useEdscStore = create<EdscStore>()(
  immer(
    devtools(
      (...args) => ({
        ...createDataQualitySummariesSlice(...args),
        ...createEarthdataDownloadRedirectSlice(...args),
        ...createEarthdataEnvironmentSlice(...args),
        ...createFacetParamsSlice(...args),
        ...createFocusedCollectionSlice(...args),
        ...createFocusedGranuleSlice(...args),
        ...createHomeSlice(...args),
        ...createMapSlice(...args),
        ...createProjectPanelsSlice(...args),
        ...createPortalSlice(...args),
        ...createPreferencesSlice(...args),
        ...createProjectSlice(...args),
        ...createQuerySlice(...args),
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
