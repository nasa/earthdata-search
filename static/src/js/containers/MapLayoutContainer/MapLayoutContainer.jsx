// MapLayoutContainer.jsx
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const MapLayoutContainer = ({ children, panelsRef }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const updateMapOffset = () => {
      if (containerRef.current) {
        const sidebarEl = document.querySelector('.sidebar')
        const panelEl = document.querySelector('.panels')
        const panelsSection = document.querySelector('.panels')

        let totalOffset = 0

        // Add sidebar width if available
        if (sidebarEl) totalOffset += sidebarEl.getBoundingClientRect().width
        // Add panels width if panels are open
        if (panelEl && panelsSection?.classList.contains('panels--is-open')) {
          totalOffset += panelEl.getBoundingClientRect().width
        }

        // Update the CSS variable on the container
        containerRef.current.style.setProperty('--map-offset', `${totalOffset}px`)

        // Dispatch the event
        window.dispatchEvent(new CustomEvent('mapOffsetChanged'))
      }
    }

    // Initial calculation
    updateMapOffset()

    // Observe DOM mutations and resize events
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateMapOffset()
        }
      })
    })

    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    const panelsSection = document.querySelector('.panels')
    if (panelsSection) {
      mutationObserver.observe(panelsSection, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    const resizeObserver = new ResizeObserver(updateMapOffset)
    const sidebarEl = document.querySelector('.sidebar')
    const panelEl = document.querySelector('.panels')
    if (sidebarEl) resizeObserver.observe(sidebarEl)
    if (panelEl) resizeObserver.observe(panelEl)

    window.addEventListener('resize', updateMapOffset)

    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMapOffset)
    }
  }, [])

  // Convert children to an array for processing
  const childrenArray = React.Children.toArray(children)

  // Process children to clone the SidebarContainer with the panelsRef.
  const processedChildren = childrenArray.map((child) => {
    // Ensure the child is a valid React element
    if (React.isValidElement(child)) {
      // If this element itself is the SidebarContainer, clone it with the ref
      if (child.type.displayName === 'SidebarContainer') {
        return React.cloneElement(child, { ref: panelsRef })
      }

      // Otherwise, if the element has children, process them recursively
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
    <div className="relative w-full h-full" ref={containerRef}>
      {sidePanel}
      {mapComponent}
    </div>
  )
}

MapLayoutContainer.propTypes = {
  children: PropTypes.node.isRequired,
  // PanelsRef is a ref that will be attached to the sidebar component
  panelsRef: PropTypes.oneOfType([
    PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    PropTypes.shape({ current: PropTypes.any })
  ]).isRequired
}

export default MapLayoutContainer
