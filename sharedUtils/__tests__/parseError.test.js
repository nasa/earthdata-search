import { parseError } from '../parseError'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('parseError', () => {
  describe('when standard errors are thrown', () => {
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

      describe('when a logPrefix is provided', () => {
        test('it logs the errors with the prefix', () => {
          const consoleMock = jest.spyOn(console, 'log')

          const response = parseError(new Error('Standard Error'), { logPrefix: '[Log Prefix]:' })

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['[Log Prefix]: Error: Standard Error'])

          expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({
              statusCode: 500,
              errors: [
                '[Log Prefix]: Error: Standard Error'
              ]
            })
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

  describe('axios library', () => {
    describe('with shouldLog is set to true', () => {
      describe('with no options', () => {
        test('it logs the errors', () => {
          const consoleMock = jest.spyOn(console, 'log')

          const response = parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
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

        describe('when a logPrefix is provided', () => {
          test('it logs the errors with the prefix', () => {
            const consoleMock = jest.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  errors: [
                    '400 Bad Request'
                  ]
                },
                status: 400
              }
            }, { logPrefix: '[Log Prefix]:' })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['[Log Prefix]: Error (400): 400 Bad Request'])

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

        describe('with no error name', () => {
          test('defaults the error name to `Error`', () => {
            const consoleMock = jest.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  errors: [
                    '400 Bad Request'
                  ]
                },
                status: 400
              }
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
              response: {
                data: {
                  nonErrorsKey: 'will be ignored'
                },
                status: 400
              },
              name: 'HTTP Error'
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
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
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
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
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
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
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
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          }, {
            reThrowError: true,
            shouldLog: false
          })).toThrow()

          expect(consoleMock).toBeCalledTimes(0)
        })
      })
    })

    describe('when the content type is text/html', () => {
      test('returns an error string with the status code and status text', () => {
        const consoleMock = jest.spyOn(console, 'log')

        const response = parseError({
          isAxiosError: true,
          response: {
            headers: {
              'content-type': 'text/html; charset=utf-8'
            },
            data: {
              errors: [
                '400 Bad Request'
              ]
            },
            status: 401,
            statusText: 'Unauthorized'
          },
          name: 'Error'
        }, {
          asJSON: false,
          shouldLog: false
        })

        expect(consoleMock).toBeCalledTimes(0)

        expect(response).toEqual([
          'Error (401): Unauthorized'
        ])
      })
    })
  })
})
