import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  portal: state.portal
})

/**
 * Checks the portal config for enabled features based on props passed in to the component. Renders children prop if feature is enabled in the portal config.
 * @param {Object} props The props passed into the component
 * @param {Node} props.children The children to be rendered
 * @param {Object} props.portal The portal config from Redux
 * @param {Boolean} props.authentication Flag to check if authentication is enabled in the portal config
 */
export const PortalFeatureContainer = ({
  authentication,
  children,
  portal
}) => {
  const { features = {} } = portal
  const { authentication: configAuthentication } = features

  if (authentication && configAuthentication) {
    return children
  }

  return null
}

PortalFeatureContainer.defaultProps = {
  authentication: false
}

PortalFeatureContainer.propTypes = {
  authentication: PropTypes.bool,
  children: PropTypes.node.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(PortalFeatureContainer)
