import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { EdscStore } from './types'

import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createUiSlice from './slices/createUiSlice'

const useEdscStore = create<EdscStore>()(
  devtools(
    (...args) => ({
      ...createHomeSlice(...args),
      ...createMapSlice(...args),
      ...createUiSlice(...args)
    }),
    {
      name: 'edsc-store'
    }
  )
)

export default useEdscStore
