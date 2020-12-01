import { getUser, getUsername } from '../user'

describe('getUser selector', () => {
  test('returns the user', () => {
    const state = {
      user: {
        username: 'testUser'
      }
    }

    expect(getUser(state)).toEqual({
      username: 'testUser'
    })
  })

  test('returns an empty object when there is no user', () => {
    const state = {}

    expect(getUser(state)).toEqual({})
  })
})

describe('getUsername selector', () => {
  test('returns the username', () => {
    const state = {
      user: {
        username: 'testUser'
      }
    }

    expect(getUsername(state)).toEqual('testUser')
  })

  test('returns an empty object when there is no ursProfile', () => {
    const state = {}

    expect(getUsername(state)).toEqual(undefined)
  })
})
