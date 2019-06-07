import { cmrServiceResponse } from './mocks'
import { getRelevantServices } from '../getRelevantServices'
import * as pageAllCmrResults from '../pageAllCmrResults'
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

    // Mocked data has 3 relevant services
    expect(Object.keys(relevantServices).length).toBe(3)

    const {
      'S00000001-EDSC': collectionOne,
      'S00000002-EDSC': collectionTwo,
      'S00000005-EDSC': collectionThree
    } = relevantServices

    expect(collectionOne.tagData).toEqual({
      id: 'S00000001-EDSC',
      type: 'ESI',
      url: 'http://mapserver.eol.ucar.edu/acadis/'
    })
    expect(collectionTwo.tagData).toEqual({ id: 'S00000002-EDSC', type: 'ESI' })
    expect(collectionThree.tagData).toEqual({ id: 'S00000005-EDSC', type: 'OPeNDAP' })
  })
})
