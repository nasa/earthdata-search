import { createHash } from 'node:crypto'

import AWS from 'aws-sdk'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { parseError } from '../../../sharedUtils/parseError'

// adapter for Amazon Simple Queue Service (SQS)
let sqs

/**
 * @description Request an export from cmr-graphql
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearchRequest = async (event, context) => {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    sqs ??= new AWS.SQS(getSqsConfig())

    const { body, headers } = event

    const { defaultResponseHeaders } = getApplicationConfig()


    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const jwt = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwt, earthdataEnvironment)

    if (!userId) throw Error("failed getting userId from jwt")

    try {
        const { data, requestId } = JSON.parse(body)

        if (!requestId) throw Error("missing requestId");

        const { columns, cursorpath, format = 'json', itempath, query, variables } = data

        if (!['csv', 'json'].includes(format)) throw Error("invalid format");

        const params = {
            columns,
            cursorpath,
            format,
            itempath,
            query,
            variables
        }

        // hash the params
        const key = createHash('sha256').update(JSON.stringify(Object.entries(params))).digest('hex');

        const filename = `search_results_export_${key.substring(0, 10)}.${format}`

        const extra = {
            earthdataEnvironment,
            key,
            filename,
            jwt,
            requestId
        }

        const message = { params, extra }

        const messageBody = JSON.stringify(message);

        if (!process.env.IS_OFFLINE) {
            const dbConnection = await getDbConnection()

            await dbConnection('exports').insert({
                user_id: userId,
                request_id: key,
                state: "REQUESTED",
                filename
            })

            await sqs.sendMessage({
                QueueUrl: process.env.searchExportQueueUrl,
                MessageBody: messageBody
            }).promise()
        }

        // maybe have a environmental variable to directly invoke the processing lambda instead of posting to a queue
        // this would be done for local development

        return {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                ...defaultResponseHeaders,
                'jwt-token': jwt
            },
            body: JSON.stringify({
                key
            })
        }
    } catch (e) {
        return {
            isBase64Encoded: false,
            headers: defaultResponseHeaders,
            ...parseError(e)
        }
    }
}

export default exportSearchRequest
