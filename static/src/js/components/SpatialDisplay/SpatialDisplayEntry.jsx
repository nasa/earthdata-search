import PropTypes from 'prop-types'

const SpatialDisplayEntry = (props) => {
  const { children } = props

  return children
}

SpatialDisplayEntry.defaultProps = {
  children: null
}

SpatialDisplayEntry.propTypes = {
  children: PropTypes.node
}

export default SpatialDisplayEntry
