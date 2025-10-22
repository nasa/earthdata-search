import { EdscStore } from '../types'

/**
 * Get the current Earthdata environment from Zustand store
 */
export const getEarthdataEnvironment = (
  state: EdscStore
) => state.earthdataEnvironment?.currentEnvironment
