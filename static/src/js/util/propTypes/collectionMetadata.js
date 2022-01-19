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
    s3BucketAndObjectPrefixNames: PropTypes.string,
    s3CredentialsApiEndpoint: PropTypes.string,
    s3CredentialsApiDocumentationUrl: PropTypes.string
  }),
  doi: PropTypes.shape({}),
  gibsLayers: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  hasAllMetadata: PropTypes.bool,
  nativeDataFormats: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  relatedUrls: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  scienceKeywords: PropTypes.arrayOf(PropTypes.shape({})),
  services: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    )
  }),
  shortName: PropTypes.string,
  spatial: PropTypes.shape({}),
  temporal: PropTypes.arrayOf(
    PropTypes.string
  ),
  tilingIdentificationSystems: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  urls: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  versionId: PropTypes.string
})
