import PropTypes from 'prop-types'

export const collectionMetadataPropType = PropTypes.shape({
  abstract: PropTypes.string,
  associatedDois: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  dataCenters: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  directDistributionInformation: PropTypes.shape({
    region: PropTypes.string,
    s3BucketAndObjectPrefixNames: PropTypes.arrayOf(PropTypes.string),
    s3CredentialsApiEndpoint: PropTypes.string,
    s3CredentialsApiDocumentationUrl: PropTypes.string
  }),
  doi: PropTypes.shape({}),
  gibsLayers: PropTypes.string,
  hasAllMetadata: PropTypes.bool,
  nativeDataFormats: PropTypes.arrayOf(
    PropTypes.string
  ),
  relatedUrls: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  scienceKeywords: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.string
    )
  ),
  services: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    )
  }),
  shortName: PropTypes.string,
  spatial: PropTypes.arrayOf(
    PropTypes.string
  ),
  temporal: PropTypes.arrayOf(
    PropTypes.string
  ),
  tilingIdentificationSystems: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  urls: PropTypes.shape({}),
  versionId: PropTypes.string
})
