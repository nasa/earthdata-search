import { cmrServiceResponse } from './mocks'
import { getRelevantServices } from '../getRelevantServices'

import * as pageAllCmrResults from '../../util/cmr/pageAllCmrResults'
import * as getSystemToken from '../../util/urs/getSystemToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getRelevantServices', () => {
  test('does not iterate when uneccessary', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const allCmrResultsMock = jest.spyOn(pageAllCmrResults, 'pageAllCmrResults').mockImplementationOnce(() => cmrServiceResponse)

    const relevantServices = await getRelevantServices()

    expect(allCmrResultsMock).toBeCalledTimes(1)

    // Mocked data has 4 relevant services (1 OPeNDAP, 2 ESI, 1 ECHO ORDERS)
    expect(Object.keys(relevantServices).length).toBe(4)

    const {
      'S00000001-EDSC': collectionOne,
      'S00000002-EDSC': collectionTwo,
      'S00000003-EDSC': collectionThree,
      'S00000005-EDSC': collectionFour
    } = relevantServices

    expect(collectionOne.tagData).toEqual({
      id: 'S00000001-EDSC',
      type: 'ESI',
      url: 'http://mapserver.eol.ucar.edu/acadis/'
    })
    expect(collectionTwo.tagData).toEqual({ id: 'S00000002-EDSC', type: 'ESI' })
    expect(collectionThree.tagData).toEqual({
      id: 'S00000003-EDSC',
      type: 'ECHO ORDERS',
      url: 'http://mapserver.eol.ucar.edu/acadis/'
    })
    expect(collectionFour.tagData).toEqual({ id: 'S00000005-EDSC', type: 'OPeNDAP' })
  })
})
