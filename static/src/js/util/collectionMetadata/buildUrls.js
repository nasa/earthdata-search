import { getEarthdataConfig, getClientId } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'
import { buildAuthenticatedRedirectUrl } from '../url/buildAuthenticatedRedirectUrl'

export const buildUrls = (json, authToken) => {
  const {
    conceptId: collectionId,
    shortName: providedCollectionShortName,
    versionId: collectionVersionId,
    isCwic
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
  const cmrClientId = getClientId().client

  const urls = {}

  cmrMetadataUrlFormats.forEach((type) => {
    // Direct CMR URL
    let url = `${cmrHost}/search/concepts/${collectionId}.${type.ext}`

    if (authToken !== '') {
      // If an auth token is provided route the request through Lambda
      url = buildAuthenticatedRedirectUrl(encodeURIComponent(url), authToken)
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
  } else if (json.hasGranules) {
    let cmrGranulesUrl = `${cmrHost}/search/granules.json?echo_collection_id=${collectionId}`

    if (authToken !== '') {
      // If an auth token is provided route the request through Lambda
      cmrGranulesUrl = buildAuthenticatedRedirectUrl(encodeURIComponent(cmrGranulesUrl), authToken)
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
