import { echoFormWithEmail } from './mocks'
import { getEmail } from '../getEmail'

describe('util#getEmail', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const email = getEmail(echoFormWithEmail)

    expect(email).toEqual({
      EMAIL: 'edsc-support@earthdata.nasa.gov'
    })
  })
})
