import 'array-foreach-async'
import { getSystemToken } from '../util/urs/getSystemToken'
import { addTag } from './addTag'
import { removeTag } from './removeTag'

/**
 * Accepts a Tag (or array of Tags) from SQS to process and store in our database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const processTag = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

  console.log(`Processing ${sqsRecords.length} tag(s)`)

  // Retrieve a connection to the database
  const cmrToken = await getSystemToken()

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

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
      await addTag({
        tagName,
        tagData,
        searchCriteria,
        requireGranules,
        append,
        cmrToken
      })
    }

    if (action === 'REMOVE') {
      await removeTag(tagName, searchCriteria, cmrToken)
    }
  })
}

export default processTag
