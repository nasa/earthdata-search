import { parseError } from '../parseError'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('parseError', () => {
  describe('when standard errors are throw', () => {
    describe('when shouldLog is set to true', () => {
      test('it logs the errors', () => {
        const consoleMock = jest.spyOn(console, 'log')

        const response = parseError(new Error('Standard Error'))

        expect(consoleMock).toBeCalledTimes(1)
        expect(consoleMock.mock.calls[0]).toEqual(['Error: Standard Error'])

        expect(response).toEqual({
          statusCode: 500,
          body: JSON.stringify({
            statusCode: 500,
            errors: [
              'Error: Standard Error'
            ]
          })
        })
      })
    })

    describe('when shouldLog is set to false', () => {
      test('nothing is logged', () => {
        const consoleMock = jest.spyOn(console, 'log')

        const response = parseError(new Error('Standard Error'), { shouldLog: false })

        expect(consoleMock).toBeCalledTimes(0)

        expect(response).toEqual({
          statusCode: 500,
          body: JSON.stringify({
            statusCode: 500,
            errors: [
              'Error: Standard Error'
            ]
          })
        })
      })
    })
  })

  describe('http errors', () => {
    describe('with shouldLog is set to true', () => {
      describe('with no options', () => {
        test('it logs the errors', () => {
          const consoleMock = jest.spyOn(console, 'log')

          const response = parseError({
            error: {
              errors: [
                '400 Bad Request'
              ]
            },
            name: 'HTTP Error',
            statusCode: 400
          })

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])

          expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
              statusCode: 400,
              errors: [
                '400 Bad Request'
              ]
            })
          })
        })

        describe('with no error name', () => {
          test('defaults the error name to `Error`', () => {
            const consoleMock = jest.spyOn(console, 'log')

            const response = parseError({
              error: {
                errors: [
                  '400 Bad Request'
                ]
              },
              statusCode: 400
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['Error (400): 400 Bad Request'])

            expect(response).toEqual({
              statusCode: 400,
              body: JSON.stringify({
                statusCode: 400,
                errors: [
                  '400 Bad Request'
                ]
              })
            })
          })
        })

        describe('with no errors array', () => {
          test('defaults to an array containing `Unknown Error`', () => {
            const consoleMock = jest.spyOn(console, 'log')

            const response = parseError({
              error: {
                nonErrorsKey: 'will be ignored'
              },
              name: 'HTTP Error',
              statusCode: 400
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): Unknown Error'])

            expect(response).toEqual({
              statusCode: 400,
              body: JSON.stringify({
                statusCode: 400,
                errors: [
                  'Unknown Error'
                ]
              })
            })
          })
        })
      })

      describe('with asJSON set to false', () => {
        test('returns the errors array', () => {
          const consoleMock = jest.spyOn(console, 'log')

          const response = parseError({
            error: {
              errors: [
                '400 Bad Request'
              ]
            },
            name: 'HTTP Error',
            statusCode: 400
          }, {
            asJSON: false
          })

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])

          expect(response).toEqual([
            '400 Bad Request'
          ])
        })
      })

      describe('with reThrowError set to true', () => {
        test('rethrows the error provided', () => {
          const consoleMock = jest.spyOn(console, 'log')

          expect(() => parseError({
            error: {
              errors: [
                '400 Bad Request'
              ]
            },
            name: 'HTTP Error',
            statusCode: 400
          }, {
            reThrowError: true
          })).toThrow()

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])
        })
      })
    })

    describe('with shouldLog set to false', () => {
      describe('with asJSON set to false', () => {
        test('returns the errors array', () => {
          const consoleMock = jest.spyOn(console, 'log')

          const response = parseError({
            error: {
              errors: [
                '400 Bad Request'
              ]
            },
            name: 'HTTP Error',
            statusCode: 400
          }, {
            asJSON: false,
            shouldLog: false
          })

          expect(consoleMock).toBeCalledTimes(0)

          expect(response).toEqual([
            '400 Bad Request'
          ])
        })
      })

      describe('with reThrowError set to true', () => {
        test('rethrows the error provided', () => {
          const consoleMock = jest.spyOn(console, 'log')

          expect(() => parseError({
            error: {
              errors: [
                '400 Bad Request'
              ]
            },
            name: 'HTTP Error',
            statusCode: 400
          }, {
            reThrowError: true,
            shouldLog: false
          })).toThrow()

          expect(consoleMock).toBeCalledTimes(0)
        })
      })
    })
  })
})
