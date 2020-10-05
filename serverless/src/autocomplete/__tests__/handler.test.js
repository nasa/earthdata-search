import nock from 'nock'

import * as googleClient from '@googlemaps/google-maps-services-js'

import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getGoogleMapsApiKey from '../../util/google/getGoogleMapsApiKey'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import * as getEnvironmentConfig from '../../../../sharedUtils/config'

import autocomplete from '../handler'

const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
  jest.spyOn(getGoogleMapsApiKey, 'getGoogleMapsApiKey').mockImplementation(() => 'testApiKey')
})

describe('autocomplete', () => {
  test('calls doSearchRequest', async () => {
    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    await autocomplete(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      jwtToken: 'mockJwt',
      bodyType: 'json',
      method: 'get',
      path: '/search/autocomplete',
      params: {
        q: 'ICE'
      },
      requestId: 'asdf-1234-qwer-5678'
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .get(/autocomplete/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await autocomplete(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })

  test('responds correctly when an exception is thrown', async () => {
    jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => { throw new Error('Code Exception Occurred') })

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await autocomplete(event, {})

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Error: Code Exception Occurred')
  })

  describe('spatial', () => {
    beforeEach(() => {
      // Manage resetting ENV variables
      jest.resetModules()
      process.env = { ...OLD_ENV }
      delete process.env.NODE_ENV
    })

    afterEach(() => {
      // Restore any ENV variables overwritten in tests
      process.env = OLD_ENV
    })

    describe('google', () => {
      beforeEach(() => {
        process.env.geocodingService = ''
      })

      test('correctly returns when no bounds are returned', async () => {
        const event = {
          body: JSON.stringify({
            params: {
              type: 'spatial',
              q: 'Alexandria'
            },
            requestId: 'asdf-1234-qwer-5678'
          })
        }

        const response = await autocomplete(event, {})


        const { body } = response
        const parsedBody = JSON.parse(body)
        const { errors } = parsedBody
        const [errorMessage] = errors

        expect(errorMessage).toEqual('Error: Geocoder () not supported')
      })
    })

    describe('google', () => {
      beforeEach(() => {
        process.env.geocodingService = 'google'
      })

      test('correctly returns when no bounds are returned', async () => {
        jest.spyOn(googleClient, 'Client').mockImplementationOnce(() => ({
          geocode: jest.fn(() => ({
            data: {
              results: [
                {
                  formatted_address: 'Alexandria, VA, USA',
                  geometry: {
                    location: {
                      lat: 38.8048355,
                      lng: -77.0469214
                    }
                  },
                  place_id: 'ChIJ8aukkz5NtokRLAHB24Ym9dc'
                }
              ]
            }
          }))
        }))

        const event = {
          body: JSON.stringify({
            params: {
              type: 'spatial',
              q: 'Alexandria'
            },
            requestId: 'asdf-1234-qwer-5678'
          })
        }

        const response = await autocomplete(event, {})

        const { body } = response
        const parsedBody = JSON.parse(body)

        expect(parsedBody).toEqual([{
          name: 'Alexandria, VA, USA',
          point: [
            38.8048355,
            -77.0469214
          ]
        }])
      })

      test('correctly returns a full result', async () => {
        jest.spyOn(googleClient, 'Client').mockImplementationOnce(() => ({
          geocode: jest.fn(() => ({
            data: {
              results: [
                {
                  formatted_address: 'Alexandria, VA, USA',
                  geometry: {
                    bounds: {
                      northeast: {
                        lat: 38.845011,
                        lng: -77.0372879
                      },
                      southwest: {
                        lat: 38.785216,
                        lng: -77.144359
                      }
                    },
                    location: {
                      lat: 38.8048355,
                      lng: -77.0469214
                    }
                  },
                  place_id: 'ChIJ8aukkz5NtokRLAHB24Ym9dc'
                }
              ]
            }
          }))
        }))

        const event = {
          body: JSON.stringify({
            params: {
              type: 'spatial',
              q: 'Alexandria'
            },
            requestId: 'asdf-1234-qwer-5678'
          })
        }

        const response = await autocomplete(event, {})

        const { body } = response
        const parsedBody = JSON.parse(body)

        expect(parsedBody).toEqual([{
          name: 'Alexandria, VA, USA',
          point: [
            38.8048355,
            -77.0469214
          ],
          bounding_box: [
            -77.144359,
            38.785216,
            -77.0372879,
            38.845011
          ]
        }])
      })
    })

    describe('nominatim', () => {
      beforeEach(() => {
        process.env.geocodingService = 'nominatim'

        jest.spyOn(getEnvironmentConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'http://localhost' }))
      })

      test('correctly returns a full result', async () => {
        process.env.geocodingIncludePolygons = 'false'

        nock(/openstreetmap/)
          .get(/search/)
          .reply(200, [
            {
              display_name: 'Alexandria, VA, USA',
              lat: 38.8048355,
              lon: -77.0469214,
              place_id: 235545611,
              boundingbox: [
                -77.144359,
                38.785216,
                -77.0372879,
                38.845011
              ]
            }
          ])

        const event = {
          body: JSON.stringify({
            params: {
              type: 'spatial',
              q: 'Alexandria'
            },
            requestId: 'asdf-1234-qwer-5678'
          })
        }

        const response = await autocomplete(event, {})

        const { body } = response
        const parsedBody = JSON.parse(body)

        expect(parsedBody).toEqual([{
          name: 'Alexandria, VA, USA',
          point: [
            38.8048355,
            -77.0469214
          ],
          bounding_box: [
            -77.0372879,
            -77.144359,
            38.845011,
            38.785216
          ]
        }])
      })

      test('correctly returns a full result with polygons enabled', async () => {
        process.env.geocodingIncludePolygons = 'true'

        nock(/openstreetmap/)
          .get(/search/)
          .reply(200, [
            {
              display_name: 'Alexandria, VA, USA',
              lat: 38.8048355,
              lon: -77.0469214,
              place_id: 235545611,
              boundingbox: [
                -77.144359,
                38.785216,
                -77.0372879,
                38.845011
              ],
              geojson: {
                type: 'Polygon',
                coordinates: [
                  [
                    [
                      -77.144359,
                      38.810357
                    ],
                    [
                      -77.143135,
                      38.805321
                    ],
                    [
                      -77.139862,
                      38.800202
                    ],
                    [
                      -77.1377474,
                      38.8007821
                    ],
                    [
                      -77.137562,
                      38.798169
                    ],
                    [
                      -77.11301,
                      38.802987
                    ]
                  ]
                ]
              }
            }
          ])

        const event = {
          body: JSON.stringify({
            params: {
              type: 'spatial',
              q: 'Alexandria'
            },
            requestId: 'asdf-1234-qwer-5678'
          })
        }

        const response = await autocomplete(event, {})

        const { body } = response
        const parsedBody = JSON.parse(body)

        expect(parsedBody).toEqual([{
          name: 'Alexandria, VA, USA',
          point: [
            38.8048355,
            -77.0469214
          ],
          bounding_box: [
            -77.0372879,
            -77.144359,
            38.845011,
            38.785216
          ],
          polygon: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -77.144359,
                  38.810357
                ],
                [
                  -77.143135,
                  38.805321
                ],
                [
                  -77.139862,
                  38.800202
                ],
                [
                  -77.1377474,
                  38.8007821
                ],
                [
                  -77.137562,
                  38.798169
                ],
                [
                  -77.11301,
                  38.802987
                ]
              ]
            ]
          }
        }])
      })
    })
  })
})
