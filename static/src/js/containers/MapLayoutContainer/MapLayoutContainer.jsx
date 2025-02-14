import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import './MapLayoutContainer.scss'

const MapLayoutContainer = ({ children, panelsRef }) => {
  const containerRef = useRef(null)

  const childrenArray = React.Children.toArray(children)

  const processedChildren = childrenArray.map((child) => {
    if (React.isValidElement(child)) {
      if (child.type.displayName === 'SidebarContainer') {
        return React.cloneElement(child, { ref: panelsRef })
      }

      if (child.props && child.props.children) {
        const updatedChild = React.cloneElement(child, {
          children: React.Children.map(child.props.children, (subChild) => {
            if (React.isValidElement(subChild) && subChild.type.displayName === 'SidebarContainer') {
              return React.cloneElement(subChild, { ref: panelsRef })
            }

            return subChild
          })
        })

        return updatedChild
      }
    }

    return child
  })

  const [sidePanel, mapComponent] = processedChildren

  return (
    <div className="map-layout-container" ref={containerRef}>
      {sidePanel}
      {mapComponent}
    </div>
  )
}

MapLayoutContainer.propTypes = {
  children: PropTypes.node.isRequired,
  panelsRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(HTMLDivElement) })
  ]).isRequired
}

export default MapLayoutContainer
