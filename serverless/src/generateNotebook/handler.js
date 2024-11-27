import axios from 'axios'
import Handlebars from 'handlebars'
import { v4 as uuidv4 } from 'uuid'

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import moment from 'moment'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'
import { getJwtToken } from '../util/getJwtToken'

import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

import { getS3Client } from '../../../static/src/js/util/getS3Client'

import notebookTemplate from './notebookTemplate.ipynb'

let s3Client

/**
 * Generates Jupyter notebook based on parameters.
 * It fetches granule information from Graphql, creates a notebook template,
 * and uploads the result to S3, providing a signed URL for download.
 *
 * @param {Object} event Details about the HTTP request that it received
 */
const generateNotebook = async (event) => {
  const { body } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { GENERATE_NOTEBOOKS_BUCKET_NAME: generateNotebooksBucketName } = process.env

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const params = JSON.parse(body)

  const {
    boundingBox,
    referrerUrl,
    granuleId,
    variableId
  } = params

  let boundingBoxValues
  if (boundingBox) {
    const [minLon, minLat, maxLon, maxLat] = boundingBox.split(',')
    boundingBoxValues = {
      minLon,
      minLat,
      maxLon,
      maxLat
    }
  }

  const { headers } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const generatedTime = moment().utc().format('MMMM DD, YYYY [at] HH:mm:ss [UTC]')

  const jwtToken = getJwtToken(event)

  const graphQLHeader = {
    'Content-Type': 'application/json'
  }

  // The authorizer will have already validated the token if it exists
  if (jwtToken) {
    const { access_token: accessToken } = await
    getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)
    graphQLHeader.Authorization = `Bearer ${accessToken}`
  }

  const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  const graphQlUrl = `${graphQlHost}/api`

  const graphqlQuery = `
    query Granules($granuleParams: GranulesInput, $variablesParams: VariablesInput) {
      granules(params: $granuleParams) {
        count
        items {
          conceptId
          title
          collection {
            conceptId
            shortName
            title
            variables(params: $variablesParams) {
              items {
                name
              }
            }
          }
        }
      }
    }
  `

  try {
    const granuleResponse = await axios({
      url: graphQlUrl,
      method: 'post',
      data: {
        query: graphqlQuery,
        variables: {
          granuleParams: {
            conceptId: granuleId
          },
          variablesParams: {
            conceptId: variableId
          }
        }
      },
      headers: graphQLHeader
    })

    const { data: responseData } = granuleResponse
    const { data } = responseData
    const { granules } = data
    const { items: granulesItems } = granules
    const { collection, title: granuleTitle } = granulesItems[0]

    const {
      conceptId: collectionId,
      shortName,
      title: collectionTitle,
      variables
    } = collection

    const { items: variableItems } = variables
    const { name: variableName } = variableItems[0]

    // Read the Jupyter notebook template file
    const templateContent = JSON.stringify(notebookTemplate)

    // Construct the base URL for Earthdata Search based on the environment
    const baseUrl = earthdataEnvironment === 'prod'
      ? 'https://search.earthdata.nasa.gov'
      : `https://search.${earthdataEnvironment}.earthdata.nasa.gov`

    // Compile the template content using Handlebars
    const template = Handlebars.compile(templateContent)

    // Prepare data for template rendering
    const notebookContext = {
      baseUrl,
      boundingBox: boundingBoxValues,
      collectionId,
      collectionTitle,
      generatedTime,
      granuleId,
      granuleTitle,
      referrerUrl,
      variable: variableName
    }

    // Render the notebook template with the prepared context
    const renderedNotebookString = template(notebookContext)

    // Parse the rendered notebook string back into a JSON object
    const parsedNotebook = JSON.parse(renderedNotebookString)

    const fileName = `${granuleTitle.slice(0, 100)}_${shortName}_sample-notebook.ipynb`

    // Generates notebook key
    const key = `notebook/${uuidv4()}/${fileName}`

    // Create a command to put the notebook into S3
    const createCommand = new PutObjectCommand({
      Bucket: generateNotebooksBucketName,
      Body: JSON.stringify(parsedNotebook),
      Key: key,
      ContentDisposition: `attachment; filename="${fileName}"`
    })

    const response = await s3Client.send(createCommand)

    const { $metadata: metadata } = response
    const { httpStatusCode: statusCode } = metadata

    // If the upload was successful, generate a signed URL for the notebook
    // and redirect the user to it
    if (statusCode === 200) {
      // Logs out uuid/filename
      console.log(`Successfully created ${key}`)

      const getObjectCommand = new GetObjectCommand({
        Bucket: generateNotebooksBucketName,
        Key: key
      })

      // Generate a signed URL for the uploaded notebook
      const signedUrl = await getSignedUrl(s3Client, getObjectCommand)

      return {
        statusCode: 200,
        headers: {
          ...defaultResponseHeaders
        },
        body: JSON.stringify({
          downloadUrl: signedUrl
        })
      }
    }

    throw new Error('Failed to save notebook to S3')
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default generateNotebook
