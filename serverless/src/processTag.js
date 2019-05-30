import 'array-foreach-async'
import 'pg'
import { getSystemToken } from './util'
import { addTag } from './processTag/addTag'
import { removeTag } from './processTag/removeTag'

let cmrToken = null

/**
 * Handler that accepts a Tag (or array of Tags) from SQS to process and store in our database
 */
export default async function processTag(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { Records: sqsRecords = [] } = event

  console.log(`Processing ${sqsRecords.length} tag(s)`)

  cmrToken = await getSystemToken(cmrToken)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    console.log('body', body)

    const providedTag = JSON.parse(body)

    const {
      action,
      append,
      requireGranules,
      searchCriteria,
      tagData,
      tagName
    } = providedTag

    if (action === 'ADD') {
      await addTag(tagName, tagData, searchCriteria, requireGranules, append, cmrToken)
    }

    if (action === 'REMOVE') {
      await removeTag(tagName, searchCriteria, cmrToken)
    }
  })

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(sqsRecords)
  }
}
