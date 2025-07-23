import { EarthdataEnvironmentSlice, ImmerStateCreator } from '../types'

// @ts-expect-error This file does not have types
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'

const initialState = deployedEnvironment()

const createEarthdataEnvironmentSlice: ImmerStateCreator<EarthdataEnvironmentSlice> = () => ({
  earthdataEnvironment: {
    currentEnvironment: initialState
  }
})

export default createEarthdataEnvironmentSlice
