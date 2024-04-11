import PropTypes from 'prop-types'

export const locationPropType = PropTypes.shape({
  pathname: PropTypes.string,
  search: PropTypes.string,
  hash: PropTypes.string,
  key: PropTypes.string
})
