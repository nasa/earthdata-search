import PropTypes from 'prop-types'

export const granuleMetadataPropType = PropTypes.objectOf(
  PropTypes.shape({
    browseFlag: PropTypes.bool,
    browseUrl: PropTypes.string,
    collectionConceptId: PropTypes.string,
    coordinateSystem: PropTypes.string,
    dataCenter: PropTypes.string,
    datasetId: PropTypes.string,
    dayNightFlag: PropTypes.string,
    formattedTemporal: PropTypes.arrayOf(PropTypes.string).isRequired,
    granuleThumbnail: PropTypes.string,
    id: PropTypes.string.isRequired,
    isCwic: PropTypes.bool,
    links: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired,
      hreflang: PropTypes.string,
      inherited: PropTypes.bool,
      rel: PropTypes.string.isRequired,
      type: PropTypes.string
    })),
    onlineAccessFlag: PropTypes.bool,
    orbit: PropTypes.shape({
      ascending_crossing: PropTypes.string,
      end_direction: PropTypes.string,
      end_lat: PropTypes.string,
      start_direction: PropTypes.string,
      start_lat: PropTypes.string
    }),
    orbitCalculatedSpatialDomains: PropTypes.arrayOf(PropTypes.shape({
      equator_crossing_date_time: PropTypes.string,
      equator_crossing_longitude: PropTypes.string,
      orbit_number: PropTypes.string
    })),
    originalFormat: PropTypes.string,
    polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    producerGranuleId: PropTypes.string,
    thumbnail: PropTypes.string,
    timeEnd: PropTypes.string,
    timeStart: PropTypes.string,
    title: PropTypes.string.isRequired,
    updated: PropTypes.string
  })
)
