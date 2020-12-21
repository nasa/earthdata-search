import { prepareGranuleAccessParams } from '../prepareGranuleAccessParams'

const defaultParams = {
  temporal: '2020-01-01',
  day_night_flag: 'DAY'
}

const paramsWithAddedGranulesArr = {
  concept_id: ['1', '2', '3', '4'],
  temporal: '2020-01-01',
  day_night_flag: 'DAY'
}

const returnParamsWithAddedGranulesArr = {
  concept_id: ['1', '2', '3', '4'],
  page_size: 4
}

describe('prepareGranuleAccessParams', () => {
  describe('when no params are sent', () => {
    test('returns an empty object', () => {
      expect(prepareGranuleAccessParams())
        .toEqual({})
    })
  })

  describe('for params without added granules', () => {
    test('returns the correct state', () => {
      expect(prepareGranuleAccessParams(defaultParams))
        .toEqual(defaultParams)
    })
  })

  describe('for params with added granules', () => {
    test('returns the correct state', () => {
      expect(prepareGranuleAccessParams(paramsWithAddedGranulesArr))
        .toEqual(returnParamsWithAddedGranulesArr)
    })
  })
})
