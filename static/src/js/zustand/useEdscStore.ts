import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EdscStore } from './types'

import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'

const useEdscStore = create<EdscStore>()(
  immer(
    devtools(
      (...args) => ({
        ...createHomeSlice(...args),
        ...createMapSlice(...args),
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
