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

        if (sidebarEl) totalOffset += sidebarEl.getBoundingClientRect().width

        // Add panels width if panels are open
        if (panelEl && panelsSection?.classList.contains('panels--is-open')) {
          totalOffset += panelEl.getBoundingClientRect().width
        }

        containerRef.current.style.setProperty('--map-offset', `${totalOffset}px`)
        window.dispatchEvent(new CustomEvent('mapOffsetChanged'))
      }
    }

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
    <div className="relative w-full h-full" ref={containerRef}>
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
