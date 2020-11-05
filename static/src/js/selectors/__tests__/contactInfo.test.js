import { getContactInfo, getUrsProfile } from '../contactInfo'

describe('getContactInfo selector', () => {
  test('returns the contact info', () => {
    const state = {
      contactInfo: {
        ursProfile: {
          first_name: 'First'
        }
      }
    }

    expect(getContactInfo(state)).toEqual({
      ursProfile: {
        first_name: 'First'
      }
    })
  })

  test('returns an empty object when there is no contactInfo', () => {
    const state = {}

    expect(getContactInfo(state)).toEqual({})
  })
})

describe('getUrsProfile selector', () => {
  test('returns the contact info', () => {
    const state = {
      contactInfo: {
        ursProfile: {
          first_name: 'First'
        }
      }
    }

    expect(getUrsProfile(state)).toEqual({
      first_name: 'First'
    })
  })

  test('returns an empty object when there is no ursProfile', () => {
    const state = {}

    expect(getUrsProfile(state)).toEqual({})
  })
})
