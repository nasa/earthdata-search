import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'
import { FaExternalLinkAlt } from 'react-icons/fa'
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'

const SearchTour = ({ runTour, setRunTour }) => {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (runTour) {
      console.log('Tour started')
      setStepIndex(0)
    } else {
      console.log('Tour stopped')
    }
  }, [runTour])

  const steps = [
    {
      target: '.search',
      content: 'Welcome to Earthdata Search! This tour will guide you through the main features.',
      disableBeacon: true,
      placement: 'center',
      styles: {
        tooltip: {
          width: 700,
          padding: '20px',
        },
        tooltipContent: {
          fontSize: '16px',
          textAlign: 'center',
        },
      },
    },
    {
      target: '.sidebar__inner',
      content: 'This is the search sidebar. It contains the controls and filters for narrowing down your search.',
      placement: 'right',
      styles: {
        tooltip: {
          width: '500px'
        }
      }
    },
    {
      target: '.search-form__primary',
      content: 'You can search for specific collections by their Collection Id or by topic such as "Land Surface Temperature".',
      placement: 'right',
    },
    {
      target: '.search-form__secondary',
      content: (
        <div>
          <p><strong>You can further filter results through the following options:</strong></p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li><span className="tour-list-title">Temporal Selection:</span> Pick a temporal range from a calendar.</li>
            <li><span className="tour-list-title">Spatial Selection:</span> Manually set spatial boundaries by drawing on the map or uploading a shapefile.</li>
            <li><span className="tour-list-title">Advanced Search:</span> Filter search by HUC or River Reach.</li>
          </ul>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: 800,
        },
      },
    },
    // {
    //   target: '.temporal-selection-dropdown',
    //   content: 'Pick a temporal range from a calendar.',
    //   placement: 'right',
    // },
    // {
    //   target: '.spatial-selection-dropdown',
    //   content: 'Manually set spatial boundaries.',
    //   placement: 'right',
    // },
    // {
    //   target: '.search-form__button--advanced-search',
    //   content: 'Use Advanced Search.',
    //   placement: 'right',
    // },
    {
      target: '.sidebar-browse-portals',
      content: 'Enable a portal in order to refine the data available within Earthdata Search.',
      placement: 'right',
      styles: {
        tooltip: {
          width: 625,
        },
      },
    },
    {
      target: '.sidebar-section-body',
      content: (
        <div>
          <p><strong>Refine your search further with available facets, such as:</strong></p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li><span className="tour-list-title">Features</span> - Available only in Earthdata Cloud, Collections that support customization via temportal, spatial variable subsetting, reformatting, etc.</li>
            <li><span className="tour-list-title">Keywords</span> - Science terms describing collections</li>
            <li><span className="tour-list-title">Platforms</span> - Satellite, aircraft, hosting instruments etc.</li>
            <li><span className="tour-list-title">Instruments</span> - Devices that make measurements</li>
            <li><span className="tour-list-title">Organizations</span> - Responsible for archiving and/or producing data</li>
            <li><span className="tour-list-title">Projects</span> - Mission or science project</li>
            <li><span className="tour-list-title">Processing Levels</span> - Raw, geophysical variables, grid, or model</li>
            <li><span className="tour-list-title">Data Format</span> - Format of the data (ASCII, Binary, CSV, HDF, NetCDF, etc)</li>
            <li><span className="tour-list-title">Tiling System</span> - CALIPSO, Military Grid Reference System, MISR, etc.</li>
            <li><span className="tour-list-title">Horizontal Data Resolution</span> - Fidelity of the data resolution</li>
            <li><span className="tour-list-title">Latency</span> - How quickly data is available after acquisition</li>
          </ul>
          <p>
            <strong>Additional Filters:</strong>
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li><span className="tour-list-title">Filter by only collections that contain granules</span></li>
            <li><span className="tour-list-title">Filter by only EOSDIS collections</span></li>
          </ul>
          </p>
        </div>
      ),
      placement: 'right-start',
      isScrollable: true,
      styles: {
        tooltip: {
          width: 700,
        },
      },
    },
    {
      target: '.panel-section',
      content: 'Search results will be shown in the Matching Collections. Each result will have summary information along with relevant badges to allow you to quickly scan your search results to find the right collection. The panel can be resized by clicking and dragging the bar above.',
      placement: 'right',
      styles: {
        tooltip: {
          width: 700,
        },
      },
    },
    {
      target: '.leaflet-bottom.leaflet-right',
      content: (
        <div>
          <p><strong>Map Tools:</strong></p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Projection Switcher - Switch between Equitorial, North, and South Sterographic Views</li>
            <li>Draw Section - Draw a shape or select a spatial coordinate</li>
            <li>Edit/Delete Layers - Modify currently applied map layers</li>
            <li>Control Zoom - Control map zoom</li>
            <li>Map Options - Control map details (colors, borders, coastlines)</li>
          </ul>
        </div>
      ),
      placement: 'left',
      styles: {
        tooltip: {
          width: 700,
        },
      },
    },
    {
      target: '.sidebar__inner',
      content: 'Placeholder.',
      placement: 'right',
      styles: {
        tooltip: {
          width: 600,
        },
      },
    },
    {
      target: '.search',
      content: (
        <div style={{ textAlign: 'center' }}>
          <p><strong>Want to learn more?</strong> Check out this webinar to see these features in action:</p>
          <div style={{ textAlign: 'center' }}>
            <a 
              href="https://www.youtube.com/watch?v=QtfMlkd7kII" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',  // Changed to inline-flex
                alignItems: 'center',    // Align items vertically
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: '#FFFFFF',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                marginTop: '10px',
                marginBottom: '15px'
              }}
            >
              <EDSCIcon
                className="mt-4 text-window-actions__modal-icon"
                icon={FaExternalLinkAlt}
                size="1rem"
                style={{ marginRight: '8px' }}
              />
              Watch Webinar on YouTube
            </a>
          </div>
          <p>Or check out one of the following resources:</p>
          <p>
            <a 
              href="https://www.earthdata.nasa.gov/learn/earthdata-search" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 'bold' }}>Learn More</span>
            </a>
          </p>
          <p>
            <a 
              href="https://www.earthdata.nasa.gov/faq/earthdata-search-faq" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 'bold' }}>Frequently Asked Questions</span>
            </a>
          </p>
        </div>
      ),
      disableBeacon: true,
      placement: 'center',
      styles: {
        tooltip: {
          width: 600,
          padding: '20px',
        },
        tooltipContent: {
          fontSize: '16px',
        },
      },
    },
    {
      target: '.secondary-toolbar__begin-tour-button',
      content: 'You can replay this tour anytime by clicking here.',
      placement: 'right',
      styles: {
        tooltipContent: {
          fontSize: '16px',
          textAlign: 'center',
        },
      },
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data
    console.log('Joyride callback:', { action, index, status, type })

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) || action === ACTIONS.CLOSE) {
      console.log('Tour ended')
      setRunTour(false)
      setStepIndex(0)
    } else if (type === 'step:after' && action === ACTIONS.NEXT) {
      setStepIndex(index + 1)
    } else if (type === 'step:after' && action === ACTIONS.PREV) {
      setStepIndex(index - 1)
    }

    // Prevent auto-scrolling within sidebar component when highlighting
    if (type === 'step:before') {
      const element = document.querySelector('.sidebar-section-body')
      if (element) {
        element.scrollTop = 0
      }
    }
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      disableCloseOnEsc={false}
      disableOverlayClose={false}
      disableScrolling={true}
      scrollToFirstStep={false}
      spotlightClicks
      styles={{
        options: {
          primaryColor: '#007bff',
          zIndex: 10000,
          textAlign: 'left',
          width: '600px',
        },
        tooltip: {
          fontSize: '16px',
          padding: '20px',
          textAlign: 'left',
        },
        tooltipContent: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '4px',
        },
        buttonBack: {
          backgroundColor: '#6c757d',
          color: '#fff',
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '4px',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#6c757d',
          fontSize: '14px',
        },
      }}
      floaterProps={{
        disableAnimation: true,
        styles: {
          button: {
            borderRadius: '4px',
            padding: '8px 16px',
            fontSize: '14px',
          },
        },
      }}
      callback={handleJoyrideCallback}
    />
  )
}

SearchTour.propTypes = {
  runTour: PropTypes.bool.isRequired,
  setRunTour: PropTypes.func.isRequired,
}

export default SearchTour