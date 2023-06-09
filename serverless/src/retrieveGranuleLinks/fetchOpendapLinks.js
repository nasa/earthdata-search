import { mbr } from '@edsc/geo-utils'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { buildParams } from '../util/cmr/buildParams'
import { getJwtToken } from '../util/getJwtToken'

export const fetchOpendapLinks = async ({
  accessMethod,
  collectionId,
  earthdataEnvironment,
  event,
  granuleParams,
  pageNum,
  requestId
}) => {
  const { granuleLinksPageSize } = getApplicationConfig()

  const {
    bounding_box: boundingBox = [],
    circle = [],
    concept_id: conceptId = [],
    exclude = {},
    point = [],
    polygon = [],
    temporal
  } = granuleParams

  const {
    selectedVariables: variables,
    selectedOutputFormat: format
  } = accessMethod

  const ousPayload = {
    format,
    variables,
    echo_collection_id: collectionId,
    page_size: granuleLinksPageSize,
    page_num: pageNum
  }

  // If conceptId is truthy, send those granules explictly.
  if (conceptId.length) {
    ousPayload.granules = conceptId
  }

  const { concept_id: excludedGranuleIds = [] } = exclude

  if (
    boundingBox.length > 0
    || circle.length > 0
    || point.length > 0
    || polygon.length > 0
  ) {
    const {
      swLat,
      swLng,
      neLat,
      neLng
    } = mbr({
      boundingBox: boundingBox[0],
      circle: circle[0],
      point: point[0],
      polygon: polygon[0]
    })

    ousPayload.bounding_box = [swLng, swLat, neLng, neLat].join(',')
  }

  ousPayload.temporal = temporal

  // OUS has a slightly different syntax for excluding params
  if (excludedGranuleIds.length > 0) {
    ousPayload.exclude_granules = true
    ousPayload.granules = excludedGranuleIds
  }

  const permittedCmrKeys = [
    'bounding_box',
    'exclude_granules',
    'granules',
    'format',
    'page_num',
    'page_size',
    'temporal',
    'variables'
  ]

  const nonIndexedKeys = [
    'variables'
  ]

  const response = await doSearchRequest({
    jwtToken: getJwtToken(event),
    path: `/service-bridge/ous/collection/${collectionId}`,
    params: buildParams({
      body: JSON.stringify({ params: ousPayload }),
      permittedCmrKeys,
      nonIndexedKeys,
      stringifyResult: false
    }),
    requestId,
    earthdataEnvironment,
    providedHeaders: {
      Accept: 'application/vnd.cmr-service-bridge.v3+json'
    }
  })

  const { body } = response
  const { items } = JSON.parse(body)

  return items
}
