import { deobfuscateId } from '../deobfuscateId'

describe('deobfuscateId', () => {
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

    const response = deobfuscateId('2034167584')

    expect(response).toEqual(25)
  })

  test('obfuscates the id correctly', () => {
    process.env.obfuscationSpin = 5678

    const response = deobfuscateId('8541648723')

    expect(response).toEqual(25)
  })
})
