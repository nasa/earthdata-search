import PropTypes from 'prop-types'
import { granuleMetadataPropType } from './granuleMetadata'

export const projectCollectionPropType = PropTypes.objectOf(
  PropTypes.shape({
    accessMethods: PropTypes.shape({
      hierarchyMappings: PropTypes.arrayOf(PropTypes.shape({})),
      id: PropTypes.string,
      isValid: PropTypes.bool,
      keywordMappings: PropTypes.arrayOf(PropTypes.shape({})),
      longName: PropTypes.string,
      name: PropTypes.string,
      supportedOutputFormats: PropTypes.arrayOf(PropTypes.string),
      type: PropTypes.string,
      variables: PropTypes.shape({})
    }),
    granules: PropTypes.shape({
      addedGranuleIds: PropTypes.arrayOf(PropTypes.string),
      allIds: PropTypes.arrayOf(PropTypes.string),
      byId: granuleMetadataPropType,
      hits: PropTypes.number,
      isCwic: PropTypes.bool,
      isErrored: PropTypes.bool,
      isLoaded: PropTypes.bool,
      isLoading: PropTypes.bool,
      loadTime: PropTypes.number,
      params: PropTypes.shape({
        pageNum: PropTypes.number
      }),
      removedGranuleIds: PropTypes.arrayOf(PropTypes.string),
      singleGranuleSize: PropTypes.number,
      timerStart: PropTypes.number,
      totalSize: PropTypes.shape({
        size: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired
      })
    }),
    isVisible: PropTypes.bool,
    selectedAccessMethod: PropTypes.string
  })
)
