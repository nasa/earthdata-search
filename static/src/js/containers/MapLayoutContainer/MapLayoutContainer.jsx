import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

const MapLayoutContainer = ({ children }) => {
  const [mapOffset, setMapOffset] = useState(0)
  const searchPanelRef = useRef(null)

  useEffect(() => {
    const updateMapOffset = () => {
      if (searchPanelRef.current) {
        const sidebarEl = document.querySelector('.sidebar')
        const panelEl = document.querySelector('.panels')
        const panelsSection = document.querySelector('.panels')

        let totalOffset = 0

        // Only add panel width if panels are open
        if (sidebarEl) totalOffset += sidebarEl.getBoundingClientRect().width
        if (panelEl && panelsSection?.classList.contains('panels--is-open')) {
          totalOffset += panelEl.getBoundingClientRect().width
        }

        setMapOffset(totalOffset)
      }
    }

    // Initial calculation
    updateMapOffset()

    // Create mutation observer to watch for class changes on panels
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateMapOffset()
        }
      })
    })

    // Watch both body (for drag state) and panels section (for open/closed state)
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

    // Set up resize observer to handle panel size changes
    const resizeObserver = new ResizeObserver(updateMapOffset)

    // Observe both sidebar and panels for size changes
    const sidebarEl = document.querySelector('.sidebar')
    const panelEl = document.querySelector('.panels')

    if (sidebarEl) resizeObserver.observe(sidebarEl)
    if (panelEl) resizeObserver.observe(panelEl)

    // Handle window resize events
    window.addEventListener('resize', updateMapOffset)

    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMapOffset)
    }
  }, [])

  // Split children into Search and Map components
  const [searchPanel, mapComponent] = React.Children.toArray(children)

  return (
    <div className="relative w-full h-full">
      <div ref={searchPanelRef}>
        {searchPanel}
      </div>
      <div
        style={
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${mapOffset}px`,
            right: 0,
            overflow: 'hidden',
            transition: 'left 0.1s ease-out'
          }
        }
      >
        {mapComponent}
      </div>
    </div>
  )
}

MapLayoutContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default MapLayoutContainer
