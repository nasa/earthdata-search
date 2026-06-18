import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
  LogType
} from '@aws-sdk/client-lambda'

import { streamifyResponse } from 'lambda-stream'
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import {
  streamText,
  generateText,
  Output,
  tool,
  hasToolCall
} from 'ai'
import { z } from 'zod'

let bedrock

/**
 * Calls the local Python geocoder lambda. In development this is running in a docker
 * container _if_ you used `npm run start:optionals` to start the API.
 */
const callPythonLocal = async (query) => {
  const result = await fetch('http://localhost:4001/2015-03-31/functions/function/invocations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query
    })
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status_code !== 200) {
        throw new Error(`Error from local Python lambda: ${json}`)
      }

      return json.body
    })

  return result
}

/**
 * Calls the geocoder lambda to get the spatial area for a given query.
 */
const getSpatial = async (query) => {
  if (process.env.NODE_ENV === 'development') {
    return callPythonLocal(query)
  }

  const lambdaClient = new LambdaClient({
    apiVersion: '2012-11-05',
    region: 'us-east-1'
  })

  const lambdaCommand = new InvokeCommand({
    FunctionName: `earthdata-search-${process.env.STAGE_NAME}-geocoder`,
    InvocationType: InvocationType.RequestResponse,
    LogType: LogType.Tail,
    Payload: JSON.stringify({
      query
    })
  })

  const response = await lambdaClient.send(lambdaCommand)
  if (response.FunctionError) {
    throw new Error(`Geocoder invocation failed: ${response.FunctionError}`)
  }

  const responsePayload = JSON.parse(new TextDecoder().decode(response.Payload))
  if (responsePayload.status_code !== 200 || !responsePayload.body) {
    throw new Error(`Geocoder returned ${responsePayload.status_code ?? 'an invalid response'}`)
  }

  return responsePayload.body
}

export const reportFoundToolExecute = async ({ field, value }, responseStream, setResults) => {
  console.log(`Found ${field} of "${(value)}".`)
  responseStream.write(`Found ${field} of "${(value)}".\n`)

  if (field === 'keyword') {
    setResults('keyword', value)
  }

  return { ok: true }
}

export const convertTemporalToolExecute = async (
  { temporal },
  responseStream,
  setResults,
  model
) => {
  try {
    console.log(`Converting temporal expression "${temporal}" to a date range.`)
    const { output } = await generateText({
      model,
      prompt: `Convert the following input to a date range.
  - Extract the start and end dates in ISO-8601 format, always include the time, and for the end date use the full day (e.g., "YYYY-12-31T23:59:59.999Z").
  - For "last year", use Jan 1 to Dec 31 of the year before the current year.
  - For "this year", use Jan 1 to Dec 31 of the current year.
  - For specific years, use Jan 1 to Dec 31 of that year.
  - For "last month", use the first to the last day of the previous month.
  - For "this month", use the first to the last day of the current month.
  - For seasons, use their typical date ranges within the current year unless a specific year is mentioned.
  - For relative terms like "past 5 years", calculate based on the current date.
  - Always use the current date of ${new Date().toISOString()} as the reference point for relative time expressions.

  Input: "${temporal}"`,
      output: Output.object({
        schema: z.object({
          startDate: z.string(),
          endDate: z.string()
        })
      })
    })

    setResults('temporal', output)
  } catch (error) {
    console.error('Error during temporal conversion:', error)
    responseStream.write('Error during temporal conversion\n')
  }

  return { ok: true }
}

export const lookupSpatialToolExecute = async ({ spatial }, setResults) => {
  setResults('spatial', spatial)

  if (process.env.USE_GEOCODER !== 'true') {
    // If we aren't geocoding, set a default spatial area for testing purposes. This is the bounding box for the area around Washington DC.
    setResults('spatialArea', 'POLYGON((-77.119759 38.791653, -77.119759 38.99596, -76.909155 38.99596, -76.909155 38.791653, -77.119759 38.791653))')

    return { ok: true }
  }

  console.log(`Looking up spatial area for "${spatial}" using the geocoder lambda...`)

  // Fetch the spatial area from the geocoding API using the original query
  const spatialArea = await getSpatial(spatial)

  console.log(`Geocoder lambda returned spatial area: ${spatialArea}`)

  setResults('spatialArea', spatialArea.trim())

  return { ok: true }
}

export const handler = async (event, originalResponseStream) => {
  const httpResponseMetadata = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Custom-Header': 'some-value'
    }
  }

  let responseStream = originalResponseStream

  if (process.env.NODE_ENV === 'production') {
    // This will only work in AWS Lambda environments. In development, we use the original response stream which is a PassThrough stream provided by lambda-stream.
    // eslint-disable-next-line no-undef
    responseStream = awslambda.HttpResponseStream.from(
      originalResponseStream,
      httpResponseMetadata
    )
  }

  const { queryStringParameters = {} } = event
  const { query } = queryStringParameters

  responseStream.write('Analyzing your query...\n')
  console.log(`Received query: ${query}`)

  const extractedResults = {
    keyword: null,
    query,
    spatial: null,
    spatialArea: null,
    temporal: null
  }

  if (process.env.USE_NLP_SEARCH !== 'true') {
    responseStream.write('The USE_NLP_SEARCH environment variable is not set to true. Skipping NLP search.\n')
    responseStream.write('Set USE_NLP_SEARCH=true and restart the server to enable NLP search.\n')

    extractedResults.keyword = query

    responseStream.write('Final result:\n')
    responseStream.write(JSON.stringify(extractedResults))
    responseStream.end()

    return
  }

  const setResults = (field, value) => {
    extractedResults[field] = value
  }

  const bedrockOptions = {
    region: 'us-east-1'
  }

  if (process.env.NODE_ENV !== 'production') {
    bedrockOptions.accessKeyId = process.env.AWS_ACCESS_KEY_ID
    bedrockOptions.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  }

  bedrock = createAmazonBedrock(bedrockOptions)

  const model = bedrock(process.env.BEDROCK_MODEL_ID)

  const result = streamText({
    model,
    temperature: 0,
    prompt: `
You are an extraction engine.

User query:
${query}

Required workflow:
1) Identify spatial, temporal, and keyword values from the query.
2) For every value you find, call tool "reportFound" once per field. Do not wait for the results of the reportFound tool before calling other tools.
3) If spatial exists, call tool "lookupSpatial" with the spatial value.
4) If temporal exists, call tool "convertTemporal" with the temporal value.
5) After all tools have been called and have returned their results, call the "finalCall" tool to indicate that processing is complete.`,
    tools: {
      reportFound: tool({
        inputSchema: z.object({
          field: z.enum(['spatial', 'temporal', 'keyword']),
          value: z.string()
        }),
        execute: async (input) => reportFoundToolExecute(input, responseStream, setResults)
      }),
      convertTemporal: tool({
        inputSchema: z.object({
          temporal: z.string()
        }),
        execute: async (input) => convertTemporalToolExecute(
          input,
          responseStream,
          setResults,
          model
        )
      }),
      lookupSpatial: tool({
        inputSchema: z.object({
          spatial: z.string()
        }),
        execute: async (input) => lookupSpatialToolExecute(input, setResults)
      }),
      finalCall: tool({
        inputSchema: z.object({}),
        execute: async () => {
          console.log('Final tool call executed. All tools should have been called at this point.')

          return { ok: true }
        }
      })
    },
    onError: async (error) => {
      console.log('Error during text generation:', error)
      responseStream.write(`Error: ${error.message}\n`)
      responseStream.end()
    },
    stopWhen: hasToolCall('finalAnswer'),
    onFinish: async ({ text }) => {
      console.log('streamText finished, called with text:', text)
      console.log('Extraction complete. Final results:', JSON.stringify(extractedResults))

      responseStream.write('Final result:\n')
      responseStream.write(JSON.stringify(extractedResults))

      responseStream.end()
    }
  })

  // Force consumption/completion. The onFinish callback is not guaranteed to be called if the stream is not fully consumed.
  await result.text
}

export default streamifyResponse(handler)
