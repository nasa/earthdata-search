import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'
import { FaExternalLinkAlt, FaInfoCircle, FaPlus } from 'react-icons/fa'
import Button from '../Button/Button'
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'
import './SearchTour.scss'

const SearchTour = ({ runTour, setRunTour }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const dontShowTour = localStorage.getItem('dontShowTour')
    if (dontShowTour === 'true') {
      setRunTour(false)
    }
    setDontShowAgain(dontShowTour === 'true')
  }, [setRunTour])

  useEffect(() => {
    if (runTour) {
      console.log('Tour started')
      setStepIndex(0)
    } else {
      console.log('Tour stopped')
    }
  }, [runTour])

  const handleDontShowAgainChange = (e) => {
    const checked = e.target.checked
    setDontShowAgain(checked)
    localStorage.setItem('dontShowTour', checked.toString())
  }


  const steps = [
    {
      target: '.search',
      content: (
        <div>
          <h2 className="tour-heading">Welcome to Earthdata Search!</h2>
          <p className="tour-subheading">Let’s start with a quick tour...</p>
          <p className="tour-content">
            Get acquainted with Earthdata Search by taking our guided tour, where you’ll learn how to search for data, use the map, create your first project, and manage your preferences.
          </p>
          <p className="tour-note">
            If you want to skip the tour for now, it is always available by clicking <strong>Show Tour</strong> at the top of the page.
          </p>
          <div className="tour-intro-buttons">
            <Button
              className="button-tour-start"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Take the tour
            </Button>
            <Button
              className="button-tour-skip"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setRunTour(false)
                setStepIndex(0)
              }}
            >
              Skip for now
            </Button>
          </div>
        </div>
      ),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.sidebar__inner',
      content: (
        <div>
          <p className="tour-content">
            This area contains the filters used when searching for collections (datasets produced by an organization) and their granules (sets of files containing data).
          </p>
          <p className="tour-content">
            Available filters include keyword search, spatial and temporal bounds, and advanced search options.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1)
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '500px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      }
    },
    {
      target: '.search-form__primary',
      content: (
        <div>
          <p className="tour-content">
            Search for collections by topic (e.g., "Land Surface Temperature"), by collection name, or by CMR Concept ID.
          </p>
          <p className="tour-content">
            As you type, suggestions for matching topics and keywords will be displayed. When selected, they will be applied as additional search filters.
          </p>
          <div className="tour-info-box">
            <p>Find more information about the&nbsp;
              <a href="https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html" target="_blank" rel="noopener noreferrer">Common Metadata Repository (CMR) <EDSCIcon icon={FaExternalLinkAlt} /></a> 
            </p>
          </div>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1)
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '600px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      }
    },
    {
      target: '.temporal-selection-dropdown',
      content: (
        <div>
          <p className="tour-content">
            Use the temporal filters to limit search results to a specific date and time range.
          </p>
          <p className="tour-content">
            A recurring filter can be applied to search a repeating range between specified years.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '400px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      }
    },
  
    {
      target: '.spatial-selection-dropdown',
      content: (
        <div>
          <p className="tour-content">
            Use the spatial filters to limit search results to the specified area of interest.
          </p>
          <p className="tour-content">
            To set the spatial area using a polygon, rectangle, point and radius, or circle, select an option from the menu and then draw on the map or manually enter coordinates.
          </p>
          <p className="tour-content">
            Upload a shapefile (KML, KMZ, ESRI, etc.) to set the spatial area with a file.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '400px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      }
    },
  
    {
      target: '.search-form__button--advanced-search',
      content: (
        <div>
          <p className="tour-content">
            Use Advanced Search parameters to filter results using features like Hydrologic Unit Code (HCU) or SWORD River Reach.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '400px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      }
    },
    {
      target: '.sidebar-browse-portals',
      content: (
        <div>
          <p className="tour-content">
            Choose a portal to refine search results to a particular area of study, project, or organization.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1)
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      disableScrolling: true,
      styles: {
        tooltip: {
          width: '625px',
        },
      },
    },
    {
      target: '.sidebar-section-body',
      content: (
        <div>
          <p className="tour-content"><strong>Refine your search further with available facets, such as:</strong></p>
          <ul className="tour-list" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li><span className="tour-list-title">Features</span> - Available only in Earthdata Cloud, Collections that support customization via temporal, spatial, variable subsetting, reformatting, etc.</li>
            <li><span className="tour-list-title">Keywords</span> - Science terms describing collections</li>
            <li><span className="tour-list-title">Platforms</span> - Satellite, aircraft, hosting instruments, etc.</li>
            <li><span className="tour-list-title">Instruments</span> - Devices that make measurements</li>
            <li><span className="tour-list-title">Organizations</span> - Responsible for archiving and/or producing data</li>
            <li><span className="tour-list-title">Projects</span> - Mission or science project</li>
            <li><span className="tour-list-title">Processing Levels</span> - Raw, geophysical variables, grid, or model</li>
            <li><span className="tour-list-title">Data Format</span> - Format of the data (ASCII, Binary, CSV, HDF, NetCDF, etc.)</li>
            <li><span className="tour-list-title">Tiling System</span> - CALIPSO, Military Grid Reference System, MISR, etc.</li>
            <li><span className="tour-list-title">Horizontal Data Resolution</span> - Fidelity of the data resolution</li>
            <li><span className="tour-list-title">Latency</span> - How quickly data is available after acquisition</li>
          </ul>
          <p className="tour-content"><strong>Additional Filters:</strong></p>
          <ul className="tour-list" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li><span className="tour-list-title">Filter by only collections that contain granules</span></li>
            <li><span className="tour-list-title">Filter by only EOSDIS collections</span></li>
          </ul>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1)
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right-start',
      isScrollable: true,
      styles: {
        tooltip: {
          width: '700px',
        },
      },
    },
    {
      target: '.panel-section',
      content: (
        <div>
          <p className="tour-content">
            A high-level description is displayed for each search result to help you find the right data, including a summary, temporal range, and information about capabilities. 
            To view more information about a collection, click the <EDSCIcon icon={FaInfoCircle} /> icon.
          </p>
          <p className="tour-content">
            Add granules to a project and customize options before accessing the data. 
            To add a collection to your project, click the <EDSCIcon icon={FaPlus} /> icon.
            To add individual granules to a project, click on a search result to view and add its granules.
          </p>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1);
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '700px',
        },
      },
    },
    {
      target: '.panels__handle',
      content: (
        <div>
          <p className="tour-content">
            To make more room to view the map, the search results can be resized by clicking or dragging the bar above. The panel can be hidden or shown by clicking the handle or using the <kbd>]</kbd> key.
          </p>
          <div className="tour-info-box">
            <p>
              All keyboard shortcuts can be displayed by pressing the <kbd>?</kbd> key at any time.
            </p>
          </div>
          <div className="tour-buttons">
            <Button
              className="button-tour-previous"
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex - 1)
              }}
            >
              Previous
            </Button>
            <Button
              className="button-tour-next"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '600px',
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
                display: 'inline-flex',
                alignItems: 'center',
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
      content: (
        <div>
          <p>You can replay this tour anytime by clicking here.</p>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltipContent: {
          fontSize: '16px',
          textAlign: 'left',
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
      callback={handleJoyrideCallback}
      hideBackButton={true}
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
          // Hide the next button since we use custom buttons
          display: 'none'
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
    />
  )
}

SearchTour.propTypes = {
  runTour: PropTypes.bool.isRequired,
  setRunTour: PropTypes.func.isRequired,
}

export default SearchTour