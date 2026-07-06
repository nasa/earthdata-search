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
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running locally', () => {
      test('uses locally defined values', async () => {
        process.env.NODE_ENV = 'development'

        const connection = getCacheConnection()

        expect(connection).toEqual({
          mockFunction: expect.any(Function)
        })

        expect(mockClass).toHaveBeenCalledTimes(1)
        expect(mockClass).toHaveBeenCalledWith({
          host: 'localhost',
          port: '6379'
        })
      })
    })
  })
})
