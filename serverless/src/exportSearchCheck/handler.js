import AWS from 'aws-sdk'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getS3Config } from '../util/aws/getS3Config'
import { getSearchExportBucket } from '../util/aws/getSearchExportBucket'
import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import doesObjectExist from '../util/aws/doesObjectExist'

// AWS S3 adapter
let s3


/**
 * Check if Search Export is Ready for Download.
 * If it is, return a signed URL.
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearchCheck = async (event, context) => {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    if (process.env.IS_OFFLINE) {
        // fake/mock values when doing local development
        AWS.config.update({
            accessKeyId: Math.random().toString(),
            secretAccessKey: Math.random().toString(),
            region: 'moon'
        })
    }

    s3 ??= new AWS.S3(getS3Config())

    const { body, headers } = event

    if (!body) throw Error("post did not include a body")

    const { defaultResponseHeaders } = getApplicationConfig()

    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const jwt = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwt, earthdataEnvironment)
    if (!userId) throw Error("failed getting userId from jwt")

    // adding a little extra validation
    if (body.length > 1000) throw Error("body is too long")

    const { requestId, data } = JSON.parse(body)
    console.log(`requestId: ${requestId}`)

    const { key } = data
    if (!key) {
        return {
            isBase64Encoded: false,
            statusCode: 400,
            headers: {
                ...defaultResponseHeaders,
                'jwt-token': jwt
            },
            body: JSON.stringify({ errors: ["missing key"] })
        }
    }
    console.log(`key: ${key}`)

    const dbConnection = await getDbConnection()

    const rows = await dbConnection('exports').where({ user_id: userId, key })
    if (rows.length !== 1) {
        throw Error(`expected only one row to match user_id "${userId}" and key "${key}", but instead saw ${rows.length} matches`)
    }

    const { state } = rows[0]

    if (state !== "DONE") {
        return {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                ...defaultResponseHeaders,
                'jwt-token': jwt
            },
            body: JSON.stringify({ state })
        }
    }

    const searchExportBucket = getSearchExportBucket()
    if (!searchExportBucket) throw Error('failed to get bucket name')

    const exists = await doesObjectExist(s3, searchExportBucket, key)
    if (!exists) {
        return {
            isBase64Encoded: false,
            statusCode: 400,
            headers: {
                ...defaultResponseHeaders,
                'jwt-token': jwt
            },
            body: JSON.stringify({ errors: ["export should be ready, but we can't find it"] })
        }
    }

    const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: searchExportBucket,
        Key: key,
        Expires: 10 * 60 // pre-signed URL expires after 10 minutes
    })

    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            ...defaultResponseHeaders,
            'jwt-token': jwt
        },
        body: JSON.stringify({ state, url: signedUrl }) 
    }
}

export default exportSearchCheck
