import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EdscStore } from './types'

import createDataQualitySummariesSlice from './slices/createDataQualitySummariesSlice'
import createEarthdataDownloadRedirectSlice from './slices/createEarthdataDownloadRedirectSlice'
import createEarthdataEnvironmentSlice from './slices/createEarthdataEnvironmentSlice'
import createFacetParamsSlice from './slices/createFacetParamsSlice'
import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createPortalSlice from './slices/createPortalSlice'
import createPreferencesSlice from './slices/createPreferencesSlice'
import createProjectSlice from './slices/createProjectSlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'

const useEdscStore = create<EdscStore>()(
  immer(
    devtools(
      (...args) => ({
        ...createDataQualitySummariesSlice(...args),
        ...createEarthdataDownloadRedirectSlice(...args),
        ...createEarthdataEnvironmentSlice(...args),
        ...createFacetParamsSlice(...args),
        ...createHomeSlice(...args),
        ...createMapSlice(...args),
        ...createPortalSlice(...args),
        ...createPreferencesSlice(...args),
        ...createProjectSlice(...args),
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
