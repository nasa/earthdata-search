import { getCacheConnection } from '../getCacheConnection'

const mockClass = vi.hoisted(() => vi.fn(class {
  mockFunction = vi.fn()
}))

vi.mock('ioredis', () => ({
  default: mockClass
}))

describe('getCacheConnection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.CACHE_HOST = 'example.com'
    process.env.CACHE_PORT = '1234'
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running in a live environment', () => {
      test('returns the existing connection', async () => {
        const connection = getCacheConnection()

        expect(connection).toEqual({
          mockFunction: expect.any(Function)
        })

        expect(mockClass).toHaveBeenCalledTimes(1)
        expect(mockClass).toHaveBeenCalledWith({
          host: 'example.com',
          port: '1234'
        })

        // Reset the mock so that we can determine whether or not the mock was called
        mockClass.mockReset()

        const connection2 = getCacheConnection()

        expect(connection2).toEqual({
          mockFunction: expect.any(Function)
        })

        expect(mockClass).toHaveBeenCalledTimes(0)
      })
    })
  })
})
