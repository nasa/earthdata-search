import useEdscStore from '../../useEdscStore'
import { getEarthdataEnvironment } from '../earthdataEnvironment'

describe('getEarthdataEnvironment', () => {
  test('returns Earthdata environment from the zustand state', () => {
    expect(getEarthdataEnvironment(useEdscStore.getState())).toEqual('prod')
  })
})
