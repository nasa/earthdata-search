import { obfuscateId } from '../obfuscateId'

describe('obfuscateId', () => {
  const OLD_ENV = process.env

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

  test('obfuscates the id correctly', () => {
    process.env.obfuscationSpin = 1234

    const response = obfuscateId(25)

    expect(response).toEqual('2034167584')
  })

  test('obfuscates the id correctly', () => {
    process.env.obfuscationSpin = 5678

    const response = obfuscateId(25)

    expect(response).toEqual('8541648723')
  })
})
