import { EdscStore } from '../types'

export const getEarthdataEnvironment = (
  state: EdscStore
) => state.earthdataEnvironment?.currentEnvironment
