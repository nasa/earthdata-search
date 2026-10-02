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
  tool
} from 'ai'
import { z } from 'zod'
import { getApplicationConfig } from '../../../sharedUtils/config'

import { getItemFromCache } from '../util/cache/getItemFromCache'
import { cacheItem } from '../util/cache/cacheItem'

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
const getSpatial = async (query, skipCache = false) => {
  const isCacheEnabled = process.env.USE_CACHE === 'true'
  const cacheKey = `geocoder:${query.toLowerCase()}`
  const { GEOCODE_CACHE_EXPIRE_SECONDS } = process.env

  if (isCacheEnabled && !skipCache) {
    const cachedResult = await getItemFromCache(cacheKey)
    if (cachedResult) {
      console.log(`Found cached geocoder result for query "${query}"`)

      return cachedResult.toString()
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const result = await callPythonLocal(query)

    if (isCacheEnabled) {
      console.log(`Caching geocoder result for query "${query}"`)
      await cacheItem(cacheKey, Buffer.from(result), GEOCODE_CACHE_EXPIRE_SECONDS)
    }

    return result
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

  const result = responsePayload.body

  if (isCacheEnabled) {
    console.log(`Caching geocoder result for query "${query}"`)
    await cacheItem(cacheKey, Buffer.from(result), GEOCODE_CACHE_EXPIRE_SECONDS)
  }

  return result
}

// -----------------------------------------------------------------------------
// WORKFLOW FUNCTIONS
// -----------------------------------------------------------------------------

export const processTemporalWorkflow = async (temporal, model, responseStream) => {
  if (!temporal) return null

  try {
    console.log(`Converting temporal expression "${temporal}" to a date range.`)
    responseStream.write(`Converting temporal data: "${temporal}"...\n`)

    const { output } = await generateText({
      model,
      prompt: `Convert the following input to a date range.
  - Extract the start and end dates in ISO-8601 format, always include the time, and for the end date use the full day (e.g., "YYYY-12-31T23:59:59.999Z").
  - For "last year", use Jan 1 to Dec 31 of the year before the current year.
  - For "this year", use Jan 1 to Dec 31 of the current year.
  - For specific years, use Jan 1 to Dec 31 of that year.
  - A "decade" ALWAYS refers to a fixed, standard calendar block of 10 years. It must start on Jan 1 of a year ending in "0" and end on December 31 of a year ending in "9" (e.g., 1990-1999).
  - Never interpret "decade," "last decade," or "the past decade" as a rolling 10-year period looking backward from today's date. "Last decade" or "the previous decade" means the most recently completed calendar block.
  - For "last month", use the first to the last day of the previous month.
  - For "this month", use the first to the last day of the current month.
  - For seasons, use their most recent meteorological date ranges unless a specific year is provided. If "this <season>" is mentioned, use the current year's dates for that season. If "last <season>" is mentioned, use the previous year's dates for that season. For winter use the year that it ends in ("winter 2025" has a startDate of December 2024).
  - For relative terms like "past 5 years" or "last 5 years", calculate the start date exactly that many years prior to the current date, and use the current date as the end date and current minute as the end time.
  - For relative terms like "since [Year]", use Jan 1st of that year as the start date, and the current date as the end date and current minute as the end time.
  - For relative terms like "since [Month]", use the first day of of that month as the start date, and the current date as the end date and current minute as the end time.
  - Always use the current date of ${new Date().toISOString()} as the reference point for relative time expressions.

  Input: "${temporal}"`,
      output: Output.object({
        schema: z.object({
          startDate: z.string(),
          endDate: z.string()
        })
      })
    })

    return output
  } catch (error) {
    console.error('Error during temporal conversion:', error)
    responseStream.write('Error during temporal conversion\n')
    return null
  }
}

export const processSpatialWorkflow = async (spatial, skipCache, responseStream) => {
  if (!spatial) return null

  if (process.env.USE_GEOCODER !== 'true') {
    // If we aren't geocoding, set a default spatial area for testing purposes. 
    // This is the bounding box for the area around Washington DC.
    return 'POLYGON((-77.119759 38.791653, -77.119759 38.99596, -76.909155 38.99596, -76.909155 38.791653, -77.119759 38.791653))'
  }

  console.log(`Looking up spatial area for "${spatial}" using the geocoder lambda...`)
  
  try {
    const spatialArea = await getSpatial(spatial, skipCache)
    console.log(`Geocoder lambda returned spatial area: ${spatialArea}`)
    return spatialArea.trim()
  } catch (error) {
    console.error('Error during spatial lookup:', error)
    responseStream.write('Error during spatial lookup\n')
    return null
  }
}

// -----------------------------------------------------------------------------
// MAIN HANDLER
// -----------------------------------------------------------------------------

export const handler = async (event, originalResponseStream) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const httpResponseMetadata = {
    statusCode: 200,
    headers: {
      ...defaultResponseHeaders,
      'Content-Type': 'text/plain'
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
  const { query, skipCache: skipCacheParam } = queryStringParameters
  const skipCache = skipCacheParam === 'true'

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

  const model = bedrock(process.env.BEDROCK_MODEL_ID || 'amazon.nova-pro-v1:0')

  try {
    // STEP 1: Stream text extraction
    const result = streamText({
      model,
      temperature: 0,
      prompt: `
You are an extraction engine.

User query:
${query}

A user will be querying to search for data described by a "keyword" that are filtered by a temporal and spatial boundaries.

Required workflow:
1) Identify spatial, temporal, and keyword values from the query based on these definitions:
   - Keyword: science topic, dataset, instrument, satellite, or other search terms.
   - Spatial: geographic place or region.
   - Temporal: date, year, season, or relative time.
2) 'daily', 'monthly', 'yearly', etc. should not be recognized as temporal values. They should be included in the keyword values. (i.e. "daily precipitation" should have "daily" as part of the keyword value rather than as a temporal value.)
3) Exclude prepositional modifiers such as "around", "over", "near", and "in" from spatial values. HOWEVER, you MUST KEEP regional or directional adjectives (such as "northern", "southern", "eastern", "western", "central"). For example, extract "northern Scotland" rather than just "Scotland" (dropping the "in"), and extract "Ecuador" rather than "in Ecuador".
4) Modifiers such as "average" should be treated as part of the keyword values.
5) Exclude passive prepositions such as "during", "over", or "for" from temporal values (e.g., extract "the last 5 years" rather than "over the last 5 years"). HOWEVER, you MUST KEEP relative/directional words like "since", "before", "after", "past", or "last". These are critical for date math. For example, extract "since 2000" exactly as-is; do NOT reduce it to just "2000".
6) The keyword value should represent the core search terms. The keyword can contain multiple words that do not need to be next to each other in the original query (you can stitch separated scientific terms together). Do NOT just blindly include everything left over. You MUST completely discard any linking words or prepositions (such as "over", "in", "near", "for", "during", "of", or "at") so they do not appear in the keyword. For example, for "vegetation index over the Amazon", the keyword must be exactly "vegetation index".
7) For every value you find, call tool "reportFound" once per field. If a temporal or spatial value is NOT present in the query, do NOT call the reportFound tool for that field. Never report empty strings or "null" values. Do not wait for the results of the reportFound tool before calling other tools. If multiple spatial values exist, include all values in a single call to "reportFound".
8) Do NOT attempt to convert, format, or lookup these values yourself. Just report the raw strings you found using the reportFound tool.`,
      tools: {
        reportFound: tool({
          inputSchema: z.object({
            field: z.enum(['spatial', 'temporal', 'keyword']),
            value: z.string()
          }),
          execute: async ({ field, value }) => {
            console.log(`Found ${field} of "${value}".`)
            responseStream.write(`Found ${field} of "${value}".\n`)
            setResults(field, value)
            return { ok: true }
          }
        })
      }
    })

    // Force consumption of the stream
    await result.text
    console.log('Extraction complete. Initial results:', JSON.stringify(extractedResults))

    // STEP 2: Concurrently process the Spatial and Temporal data
    const [spatialAreaResult, temporalFormatResult] = await Promise.all([
      processSpatialWorkflow(extractedResults.spatial, skipCache, responseStream),
      processTemporalWorkflow(extractedResults.temporal, model, responseStream)
    ])

    // STEP 3: Assign finalized values to the result payload
    extractedResults.spatialArea = spatialAreaResult
    
    // Only overwrite the original temporal string if the LLM successfully formatted it to an object
    if (temporalFormatResult) {
      extractedResults.temporal = temporalFormatResult
    }

    // Output completion for the frontend
    console.log('Workflows complete. Final results:', JSON.stringify(extractedResults))
    responseStream.write('Final result:\n')
    responseStream.write(JSON.stringify(extractedResults))

  } catch (error) {
    console.error('Error during text generation or processing:', error)
    responseStream.write(`Error: ${error.message}\n`)
  } finally {
    // Ensure the response stream always closes, even on failure
    responseStream.end()
  }
}

export default streamifyResponse(handler)
