import { mockClient } from 'aws-sdk-client-mock'
import { MockLanguageModelV3 } from 'ai/test'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import {
  convertTemporalToolExecute,
  lookupSpatialToolExecute,
  handler as nlpSearchHandler,
  reportFoundToolExecute
} from '../handler'

const mockBedrock = await vi.hoisted(async () => {
  const { MockLanguageModelV3: LocalMockLanguageModelV3, simulateReadableStream } = await import('ai/test')

  return new LocalMockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          {
            type: 'text-start',
            id: 'text-1'
          },
          {
            type: 'text-delta',
            id: 'text-1',
            delta: `<thinking> The user's query is 'Find me rainfall data over California in 2020'. From this, I can identify the following:
 - Spatial value: 'California'
 - Temporal value: '2020'
 - Keyword value: 'rainfall data'

 I will first report these findings using the 'reportFound' tool. Then, I will proceed with the 'lookupSpatial' and 'convertTemporal' tools for the spatial and temporal values respectively. </thinking>`
          },
          {
            type: 'text-end',
            id: 'text-1'
          },
          {
            type: 'finish',
            finishReason: {
              unified: 'stop',
              raw: undefined
            },
            logprobs: undefined,
            usage: {
              inputTokens: {
                total: 3,
                noCache: 3,
                cacheRead: undefined,
                cacheWrite: undefined
              },
              outputTokens: {
                total: 10,
                text: 10,
                reasoning: undefined
              }
            }
          }
        ]
      })
    })
  })
})

vi.mock('@ai-sdk/amazon-bedrock', () => ({
  createAmazonBedrock: vi.fn().mockReturnValue(vi.fn().mockReturnValue(mockBedrock))
}))

const lambdaClientMock = mockClient(LambdaClient)

beforeEach(() => {
  lambdaClientMock.reset()
})

describe('nlpSearch handler', () => {
  describe('when USE_NLP_SEARCH is false', () => {
    test('returns the original query without processing', async () => {
      process.env.USE_NLP_SEARCH = 'false'
      process.env.AWS_ACCESS_KEY_ID = 'fake'
      process.env.AWS_SECRET_ACCESS_KEY = 'fake'

      const event = {
        queryStringParameters: {
          query: 'Find me rainfall data over California in 2020'
        }
      }

      const responseStream = {
        write: vi.fn(),
        end: vi.fn()
      }

      await nlpSearchHandler(event, responseStream)

      expect(responseStream.write).toHaveBeenCalledTimes(5)
      expect(responseStream.write).toHaveBeenNthCalledWith(1, 'Analyzing your query...\n')
      expect(responseStream.write).toHaveBeenNthCalledWith(2, 'The USE_NLP_SEARCH environment variable is not set to true. Skipping NLP search.\n')
      expect(responseStream.write).toHaveBeenNthCalledWith(3, 'Set USE_NLP_SEARCH=true and restart the server to enable NLP search.\n')
      expect(responseStream.write).toHaveBeenNthCalledWith(4, 'Final result:\n')
      expect(responseStream.write).toHaveBeenNthCalledWith(5, JSON.stringify({
        keyword: 'Find me rainfall data over California in 2020',
        query: 'Find me rainfall data over California in 2020',
        spatial: null,
        spatialArea: null,
        temporal: null
      }))

      expect(responseStream.end).toHaveBeenCalledTimes(1)
      expect(responseStream.end).toHaveBeenCalledWith()
    })
  })

  describe('when USE_NLP_SEARCH is true', () => {
    test('streams status messages and the final result', async () => {
      process.env.USE_NLP_SEARCH = 'true'
      process.env.USE_GEOCODER = 'false'
      process.env.AWS_ACCESS_KEY_ID = 'fake'
      process.env.AWS_SECRET_ACCESS_KEY = 'fake'

      const event = {
        queryStringParameters: {
          query: 'Find me rainfall data over California in 2020'
        }
      }

      const responseStream = {
        write: vi.fn(),
        end: vi.fn()
      }

      await nlpSearchHandler(event, responseStream)

      expect(responseStream.write).toHaveBeenCalledTimes(3)
      expect(responseStream.write).toHaveBeenNthCalledWith(1, 'Analyzing your query...\n')
      expect(responseStream.write).toHaveBeenNthCalledWith(2, 'Final result:\n')

      // The actual result isn't populated because the tools are not executed by the doStream mock. Those tools are tested separately.
      expect(responseStream.write).toHaveBeenNthCalledWith(3, '{"keyword":null,"query":"Find me rainfall data over California in 2020","spatial":null,"spatialArea":null,"temporal":null}')

      expect(responseStream.end).toHaveBeenCalledTimes(1)
      expect(responseStream.end).toHaveBeenCalledWith()
    })
  })
})

describe('reportFoundToolExecute', () => {
  test('writes the found field to the responseStream', async () => {
    const mockResponseStream = {
      write: vi.fn()
    }

    const setResults = vi.fn()

    const input = {
      field: 'spatial',
      value: 'California'
    }

    await reportFoundToolExecute(input, mockResponseStream, setResults)

    expect(mockResponseStream.write).toHaveBeenCalledTimes(1)
    expect(mockResponseStream.write).toHaveBeenCalledWith('Found spatial of "California".\n')

    expect(setResults).toHaveBeenCalledTimes(0)
  })

  describe('when the field is keyword', () => {
    test('writes the found field to the response stream and calls setResults', async () => {
      const mockResponseStream = {
        write: vi.fn()
      }

      const setResults = vi.fn()

      const input = {
        field: 'keyword',
        value: 'rainfall data'
      }

      await reportFoundToolExecute(input, mockResponseStream, setResults)

      expect(mockResponseStream.write).toHaveBeenCalledTimes(1)
      expect(mockResponseStream.write).toHaveBeenCalledWith('Found keyword of "rainfall data".\n')

      expect(setResults).toHaveBeenCalledTimes(1)
      expect(setResults).toHaveBeenCalledWith('keyword', 'rainfall data')
    })
  })
})

describe('convertTemporalToolExecute', () => {
  test('calls generateText and setResults', async () => {
    const mockResponseStream = {
      write: vi.fn()
    }

    const setResults = vi.fn()

    const input = {
      temporal: '2020'
    }

    const model = new MockLanguageModelV3({
      doGenerate: async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            endDate: '2020-12-31T23:59:59.999Z',
            startDate: '2020-01-01T00:00:00.000Z'
          })
        }],
        finishReason: {
          unified: 'stop',
          raw: undefined
        },
        usage: {
          inputTokens: {
            total: 10,
            noCache: 10,
            cacheRead: undefined,
            cacheWrite: undefined
          },
          outputTokens: {
            total: 20,
            text: 20,
            reasoning: undefined
          }
        },
        warnings: []
      })
    })

    await convertTemporalToolExecute(input, mockResponseStream, setResults, model)

    expect(mockResponseStream.write).toHaveBeenCalledTimes(0)

    expect(setResults).toHaveBeenCalledTimes(1)
    expect(setResults).toHaveBeenCalledWith('temporal', {
      endDate: '2020-12-31T23:59:59.999Z',
      startDate: '2020-01-01T00:00:00.000Z'
    })
  })

  describe('when generateText returns invalid JSON', () => {
    test('writes an error message to the response stream', async () => {
      const mockResponseStream = {
        write: vi.fn()
      }

      const setResults = vi.fn()

      const input = {
        temporal: '2020'
      }

      const model = new MockLanguageModelV3({
        doGenerate: async () => ({
          content: [{
            type: 'text',
            text: 'invalid json'
          }],
          finishReason: {
            unified: 'stop',
            raw: undefined
          },
          usage: {
            inputTokens: {
              total: 10,
              noCache: 10,
              cacheRead: undefined,
              cacheWrite: undefined
            },
            outputTokens: {
              total: 20,
              text: 20,
              reasoning: undefined
            }
          },
          warnings: []
        })
      })

      const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {})

      await convertTemporalToolExecute(input, mockResponseStream, setResults, model)

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Error during temporal conversion:', expect.any(Error))

      expect(mockResponseStream.write).toHaveBeenCalledTimes(1)
      expect(mockResponseStream.write).toHaveBeenCalledWith('Error during temporal conversion\n')

      expect(setResults).toHaveBeenCalledTimes(0)
    })
  })
})

describe('lookupSpatialToolExecute', () => {
  describe('when USE_GEOCODER is false', () => {
    test('returns a mock value', async () => {
      process.env.USE_GEOCODER = 'false'

      const setResults = vi.fn()

      const input = {
        spatial: 'California'
      }

      await lookupSpatialToolExecute(input, setResults)

      expect(setResults).toHaveBeenCalledTimes(2)
      expect(setResults).toHaveBeenCalledWith('spatial', 'California')
      expect(setResults).toHaveBeenCalledWith('spatialArea', 'POLYGON((-77.119759 38.791653, -77.119759 38.99596, -76.909155 38.99596, -76.909155 38.791653, -77.119759 38.791653))')
    })
  })

  describe('when USE_GEOCODER is true', () => {
    describe('when in development environment', () => {
      test('calls the local python lambda and sets results', async () => {
        process.env.USE_GEOCODER = 'true'
        process.env.NODE_ENV = 'development'

        global.fetch = vi.fn(() => Promise.resolve({
          json: () => Promise.resolve({
            status_code: 200,
            body: 'POLYGON((-124.482003 32.528832, -124.482003 42.009517, -114.131211 42.009517, -114.131211 32.528832, -124.482003 32.528832))'
          })
        }))

        const setResults = vi.fn()

        const input = {
          spatial: 'California'
        }

        await lookupSpatialToolExecute(input, setResults)

        expect(setResults).toHaveBeenCalledTimes(2)
        expect(setResults).toHaveBeenCalledWith('spatial', 'California')
        expect(setResults).toHaveBeenCalledWith('spatialArea', 'POLYGON((-124.482003 32.528832, -124.482003 42.009517, -114.131211 42.009517, -114.131211 32.528832, -124.482003 32.528832))')
      })
    })

    describe('when in production environment', () => {
      test('calls the python lambda and sets results', async () => {
        process.env.USE_GEOCODER = 'true'
        process.env.NODE_ENV = 'production'
        process.env.STAGE_NAME = 'sit'

        lambdaClientMock.on(InvokeCommand).resolves({
          Payload: Buffer.from(JSON.stringify({
            isBase64Encoded: false,
            statusCode: 200,
            body: 'POLYGON((-124.482003 32.528832, -124.482003 42.009517, -114.131211 42.009517, -114.131211 32.528832, -124.482003 32.528832))'
          }))
        })

        const setResults = vi.fn()

        const input = {
          spatial: 'California'
        }

        await lookupSpatialToolExecute(input, setResults)

        expect(setResults).toHaveBeenCalledTimes(2)
        expect(setResults).toHaveBeenCalledWith('spatial', 'California')
        expect(setResults).toHaveBeenCalledWith('spatialArea', 'POLYGON((-124.482003 32.528832, -124.482003 42.009517, -114.131211 42.009517, -114.131211 32.528832, -124.482003 32.528832))')
      })
    })
  })
})
