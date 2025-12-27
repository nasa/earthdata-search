import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EdscStore } from './types'

import createCollectionSlice from './slices/createCollectionSlice'
import createCollectionsSlice from './slices/createCollectionsSlice'
import createDataQualitySummariesSlice from './slices/createDataQualitySummariesSlice'
import createEarthdataDownloadRedirectSlice from './slices/createEarthdataDownloadRedirectSlice'
import createEarthdataEnvironmentSlice from './slices/createEarthdataEnvironmentSlice'
import createErrorsSlice from './slices/createErrorsSlice'
import createFacetParamsSlice from './slices/createFacetParamsSlice'
import createGranuleSlice from './slices/createGranuleSlice'
import createGranulesSlice from './slices/createGranulesSlice'
import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createPortalSlice from './slices/createPortalSlice'
import createProjectPanelsSlice from './slices/createProjectPanelsSlice'
import createProjectSlice from './slices/createProjectSlice'
import createQuerySlice from './slices/createQuerySlice'
import createSavedProjectSlice from './slices/createSavedProjectSlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'
import createUserSlice from './slices/createUserSlice'

const useEdscStore = create<EdscStore>()(
  subscribeWithSelector(
    immer(
      devtools(
        (...args) => ({
          ...createCollectionSlice(...args),
          ...createCollectionsSlice(...args),
          ...createDataQualitySummariesSlice(...args),
          ...createEarthdataDownloadRedirectSlice(...args),
          ...createEarthdataEnvironmentSlice(...args),
          ...createErrorsSlice(...args),
          ...createFacetParamsSlice(...args),
          ...createGranuleSlice(...args),
          ...createGranulesSlice(...args),
          ...createHomeSlice(...args),
          ...createMapSlice(...args),
          ...createProjectPanelsSlice(...args),
          ...createPortalSlice(...args),
          ...createProjectSlice(...args),
          ...createQuerySlice(...args),
          ...createSavedProjectSlice(...args),
          ...createShapefileSlice(...args),
          ...createTimelineSlice(...args),
          ...createUiSlice(...args),
          ...createUserSlice(...args)
        }),
        {
          name: 'edsc-store',
          // Enable the devtools in non-test environments
          enabled: process.env.NODE_ENV !== 'test'
        }
      )
    )
  )
)

export default useEdscStore
