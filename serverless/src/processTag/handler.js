import 'array-foreach-async'

import axios from 'axios'

import { isEqual } from 'lodash'

import { addTag } from './addTag'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getValueForTag } from '../../../sharedUtils/tags'
import { removeTag } from './removeTag'
import { stringify } from '../../../static/src/js/util/url/url'

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
      searchCriteria = {},
      tagData,
      tagName
    } = providedTag

    if (action === 'ADD') {
      const { collection = {} } = searchCriteria
      const { condition = {} } = collection
      const { concept_id: conceptId } = condition

      let existingTagData = {}

      if (conceptId) {
        const { cmrHost } = getEarthdataConfig(deployedEnvironment())
        const collectionSearchUrl = `${cmrHost}/search/concepts/${conceptId}.json`

        const response = await axios({
          method: 'post',
          url: collectionSearchUrl,
          data: stringify({
            ...condition,
            include_tags: tagName
          }, { indices: false, arrayFormat: 'brackets' }),
          headers: {
            'Client-Id': getClientId().background,
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${cmrToken}`
          }
        })

        const { data } = response
        const { tags } = data

        existingTagData = getValueForTag(tagName, tags, '')

        const strippedExistingTagData = existingTagData
        const strippedTagData = tagData

        // There are a few jobs that add an 'updated_at' field to the tag data which will always
        // make the tags appear different so we want to ensure we strip that out before comparing
        delete strippedExistingTagData.updated_at
        delete strippedTagData.updated_at

        // Prevent creating tag data that already exists
        if (!isEqual(strippedTagData, strippedExistingTagData)) {
          await addTag({
            tagName,
            tagData,
            searchCriteria,
            requireGranules,
            append,
            cmrToken
          })
        } else {
          console.log(`Tag (${tagName}) for ${conceptId} matches existing value`)
        }
      } else {
        await addTag({
          tagName,
          tagData,
          searchCriteria,
          requireGranules,
          append,
          cmrToken
        })
      }
    }

    if (action === 'REMOVE') {
      await removeTag(tagName, searchCriteria, cmrToken)
    }
  })
}

export default processTag
