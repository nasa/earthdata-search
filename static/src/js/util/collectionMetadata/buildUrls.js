import { getEarthdataConfig, getClientId, getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

export const buildUrls = (json, authToken) => {
  const {
    id: collectionId,
    short_name: providedCollectionShortName,
    version_id: collectionVersionId,
    is_cwic: isCwic
  } = json

  const collectionShortName = encodeURI(providedCollectionShortName)

  const cmrMetadataUrlFormats = [
    { ext: 'html', title: 'HTML' },
    { ext: 'native', title: 'Native' },
    { ext: 'atom', title: 'ATOM' },
    { ext: 'echo10', title: 'ECHO10' },
    { ext: 'iso19115', title: 'ISO19115' },
    { ext: 'dif', title: 'DIF' }
  ]

  const eartdataConfig = getEarthdataConfig(cmrEnv())
  const {
    cmrHost,
    opensearchRoot
  } = eartdataConfig
  const { apiHost } = getEnvironmentConfig()
  const cmrClientId = getClientId().client

  const urls = {}

  cmrMetadataUrlFormats.forEach((type) => {
    // Direct CMR URL
    let url = `${cmrHost}/search/concepts/${collectionId}.${type.ext}`

    if (authToken !== '') {
      // If an auth token is provided route the request through Lambda
      url = `${apiHost}/concepts/metadata?url=${encodeURIComponent(url)}&token=${authToken}`
    }

    urls[type.ext] = {
      title: type.title,
      href: url
    }
  })

  let provider = ''
  if (typeof collectionId === 'string') provider = collectionId.split('-')[collectionId.split('-').length - 1]
  provider = encodeURI(provider)

  const opensearchUrl = `${opensearchRoot}/granules/descriptor_document.xml`

  urls.osdd = {
    title: 'OSDD',
    href: `${opensearchUrl}?clientId=${cmrClientId}&shortName=${collectionShortName}&versionId=${collectionVersionId}&dataCenter=${provider}`
  }

  if (isCwic) {
    // TODO: Replace the `href` here with the value stored in the tag created in EDSC-2265
    // urls.granuleDatasource = {
    //   title: 'CWIC',
    //   href: 'example.com'
    // }
  } else if (json.has_granules) {
    let cmrGranulesUrl = `${cmrHost}/search/granules.json?echo_collection_id=${collectionId}`
    if (authToken !== '') {
      // If an auth token is provided route the request through Lambda
      cmrGranulesUrl = `${apiHost}/granules?url=${encodeURIComponent(cmrGranulesUrl)}&token=${authToken}`
    }

    urls.granuleDatasource = {
      title: 'CMR',
      href: cmrGranulesUrl
    }
  }

  // TODO: GIBS
  // TODO: Opendap
  // TODO: Modaps

  return urls
}

export default buildUrls
