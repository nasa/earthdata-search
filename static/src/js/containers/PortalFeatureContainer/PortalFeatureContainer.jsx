import PropTypes from 'prop-types'
import useEdscStore from '../../zustand/useEdscStore'

/**
 * Checks the portal config for enabled features based on props passed in to the component. Renders children prop if feature is enabled in the portal config.
 * @param {Object} props The props passed into the component
 * @param {Node} props.children The children to be rendered
 * @param {Boolean} props.advancedSearch Flag to check if advanced search is enabled in the portal config
 * @param {Boolean} props.authentication Flag to check if authentication is enabled in the portal config
 * @param {Boolean} props.nonEosdisCheckbox Flag to check if the non-EOSDIS checkbox is enabled in the portal config
 * @param {Boolean} props.onlyGranulesCheckbox Flag to check if the only granules checkbox is enabled in the portal config
 */
export const PortalFeatureContainer = ({
  advancedSearch = false,
  authentication = false,
  children,
  nonEosdisCheckbox = false,
  onlyGranulesCheckbox = false
}) => {
  const portal = useEdscStore((state) => state.portal)
  const {
    features = {},
    ui = {}
  } = portal
  const {
    advancedSearch: configAdvancedSearch,
    authentication: configAuthentication
  } = features
  const {
    showNonEosdisCheckbox,
    showOnlyGranulesCheckbox
  } = ui

  if (advancedSearch && configAdvancedSearch) {
    return children
  }

  if (authentication && configAuthentication) {
    return children
  }

  if (nonEosdisCheckbox && showNonEosdisCheckbox) {
    return children
  }

  if (onlyGranulesCheckbox && showOnlyGranulesCheckbox) {
    return children
  }

  return null
}

PortalFeatureContainer.propTypes = {
  advancedSearch: PropTypes.bool,
  authentication: PropTypes.bool,
  children: PropTypes.node.isRequired,
  nonEosdisCheckbox: PropTypes.bool,
  onlyGranulesCheckbox: PropTypes.bool
}

export default PortalFeatureContainer
