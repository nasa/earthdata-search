import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { getValueForTag } from '../tags'

export const buildUrls = (json) => {
  const urlTypes = [
    { ext: 'html', title: 'HTML' },
    { ext: 'native', title: 'Native' },
    { ext: 'atom', title: 'ATOM' },
    { ext: 'echo10', title: 'ECHO10' },
    { ext: 'iso19115', title: 'ISO19115' },
    { ext: 'dif', title: 'DIF' }
    // { ext: 'smap_iso', title: 'SMAP ISO' }
  ]

  const urls = {}
  const metadataUrl = `${getEarthdataConfig('prod').cmrHost}/search/concepts/${json.id}`

  urlTypes.forEach((type) => {
    urls[type.ext] = {
      title: type.title,
      href: `${metadataUrl}.${type.ext}`
    }
  })

  // This should be coming from a config or lambda
  const cmrClientId = 'edsc-prod'

  let provider = ''
  if (typeof json.id === 'string') provider = json.id.split('-')[json.id.split('-').length - 1]
  provider = encodeURI(provider)

  const collectionShortName = encodeURI(json.short_name)
  const collectionVersionId = json.version_id

  const opensearchUrl = `${getEarthdataConfig('prod').opensearchRoot}/granules/descriptor_document.xml`

  urls.osdd = {
    title: 'OSDD',
    href: `${opensearchUrl}?utf8=%E2%9C%93&clientId=${cmrClientId}&shortName=${collectionShortName}&versionId=${collectionVersionId}&dataCenter=${provider}&commit=Generate`
  }

  if (getValueForTag('datasource')) {
    urls.granuleDatasource = {
      // TODO:
      title: 'datasourcegoeshere'
    }
  } else if (json.has_granules) {
    urls.granuleDatasource = {
      // TODO:
      title: 'CMR',
      href: '/cmrdatasourceurlgoeshere'
    }
  }

  // TODO: GIBS
  // TODO: Opendap
  // TODO: Modaps

  console.warn('urlTypes', urls)
  return urls
}

export default buildUrls
