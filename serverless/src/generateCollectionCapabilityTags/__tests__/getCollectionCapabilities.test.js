import nock from 'nock'

import * as getSingleGranule from '../../util/cmr/getSingleGranule'

import { getCollectionCapabilities } from '../getCollectionCapabilities'

describe('getCollectionCapabilities', () => {
  describe('cloud_cover', () => {
    describe('when undefined in the metadata', () => {
      test('sets cloud_cover to false', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { cloud_cover: cloudCover } = response

        expect(cloudCover).toEqual(false)
      })
    })

    describe('when a value is defined in the metadata', () => {
      test('sets cloud_cover to true', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC',
          cloud_cover: 20
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { cloud_cover: cloudCover } = response

        expect(cloudCover).toEqual(true)
      })
    })
  })

  describe('day_night_flag', () => {
    describe('when undefined in the metadata', () => {
      test('sets day_night_flag to false', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { day_night_flag: dayNightFlag } = response

        expect(dayNightFlag).toEqual(false)
      })
    })

    describe('when defined as UNSPECIFIED in the metadata', () => {
      test('sets day_night_flag to false', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC',
          day_night_flag: 'UNSPECIFIED'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { day_night_flag: dayNightFlag } = response

        expect(dayNightFlag).toEqual(false)
      })
    })

    describe('when a value is defined in the metadata', () => {
      test('sets day_night_flag to true', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC',
          day_night_flag: 'DAY'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { day_night_flag: dayNightFlag } = response

        expect(dayNightFlag).toEqual(true)
      })
    })
  })

  describe('online_access_flag', () => {
    describe('when undefined in the metadata', () => {
      test('sets online_access_flag to false', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { granule_online_access_flag: granuleOnlineAccessFlag } = response

        expect(granuleOnlineAccessFlag).toEqual(false)
      })
    })

    describe('when a value is defined in the metadata', () => {
      test('sets online_access_flag to true', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC',
          online_access_flag: true
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { granule_online_access_flag: granuleOnlineAccessFlag } = response

        expect(granuleOnlineAccessFlag).toEqual(true)
      })
    })
  })

  describe('orbit_calculated_spatial_domains', () => {
    describe('when undefined in the metadata', () => {
      test('sets orbit_calculated_spatial_domains to false', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC'
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains } = response

        expect(orbitCalculatedSpatialDomains).toEqual(false)
      })
    })

    describe('when a value is defined in the metadata', () => {
      test('sets orbit_calculated_spatial_domains to true', async () => {
        jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({
          id: 'G100000-EDSC',
          orbit_calculated_spatial_domains: {
            orbit_number: 1
          }
        }))

        const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

        const { orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains } = response

        expect(orbitCalculatedSpatialDomains).toEqual(true)
      })
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .post(/granules/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    // 4 Retries that are configured in getSingleGranule
    nock(/cmr/)
      .post(/granules/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    nock(/cmr/)
      .post(/granules/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    nock(/cmr/)
      .post(/granules/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    nock(/cmr/)
      .post(/granules/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })


    const response = await getCollectionCapabilities('token', { id: 'C100000-EDSC' })

    expect(response).toEqual({
      cloud_cover: false,
      day_night_flag: false,
      granule_online_access_flag: false,
      orbit_calculated_spatial_domains: false
    })
  })
})
