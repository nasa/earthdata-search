import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'
import { FaExternalLinkAlt, FaInfoCircle, FaPlus } from 'react-icons/fa'
import Button from '../Button/Button'
import TourThumbnail from '../../../assets/images/tour-video-thumbnail.png'
import EDSCIcon from '../../components/EDSCIcon/EDSCIcon'
import './SearchTour.scss'

const SearchTour = ({ runTour, setRunTour }) => {
  const MAX_STEPS = 14;

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

  useEffect(() => {
    if (stepIndex === 6) {  // Scrolling to the top to ensure "Browse Portals" is visible.
      const element = document.querySelector('.sidebar__content .simplebar-content-wrapper')
      if (element) {
        element.scrollTop = 0
      }
    }
  }, [stepIndex])

  const handleDontShowAgainChange = (e) => {
    const checked = e.target.checked
    setDontShowAgain(checked)
    localStorage.setItem('dontShowTour', checked.toString())
  }

  const StepCounter = ({ currentStep, totalSteps }) => (
    <p className="step-counter-text">
      {currentStep} OF {totalSteps}
    </p>
  )


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
              bootstrapSize="lg"
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
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            This area contains the filters used when searching for collections (datasets produced by an organization) and their granules (sets of files containing data).
          </p>
          <p className="tour-content">
            Available filters include keyword search, spatial and temporal bounds, and advanced search options.
          </p>
          <div className="tour-buttons">
            <Button
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
      target: '.search-form__primary',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
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
      target: '.temporal-selection-dropdown',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            Use the temporal filters to limit search results to a specific date and time range.
          </p>
          <p className="tour-content">
            A recurring filter can be applied to search a repeating range between specified years.
          </p>
          <div className="tour-buttons">
            <Button
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
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
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
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
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
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
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            Use Advanced Search parameters to filter results using features like Hydrologic Unit Code (HUC) or SWORD River Reach.
          </p>
          <div className="tour-buttons">
            <Button
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
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
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            Choose a portal to refine search results to a particular area of study, project, or organization.
          </p>
          <div className="tour-buttons">
            <Button
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
          width: '400px',
        },
      },
    },
    {
      target: '.sidebar-section-body',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            Refine your search further using categories like Features, Keywords, Platforms, Organizations, etc.
          </p>
          <div className="tour-buttons">
            <Button
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
      placement: 'right-start',
      disableScrolling: true,
      styles: {
        tooltip: {
          width: '400px',
        },
      },
    },
    {
      target: '.panel-section',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            A high-level description is displayed for each search result to help you find the right data, including a summary, temporal range, and information about capabilities. 
            To view more information about a collection, click the <EDSCIcon className="text-icon" icon={FaInfoCircle} /> icon.
          </p>
          <p className="tour-content">
            Add granules to a project and customize options before accessing the data. 
            To add a collection to your project, click the <EDSCIcon className="text-icon" icon={FaPlus} /> icon.
            To add individual granules to a project, click on a search result to view and add its granules.
          </p>
          <div className="tour-buttons">
            <Button
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
          width: '400px',
        },
      },
      floaterProps: {
        disableFlip: true,
        offset: 10,
      },
    },
    {
      target: '.panels__handle',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
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
          width: '400px',
        },
      },
    },
    {
      target: '.right-overlay',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p style={{ fontSize: '16px', textAlign: 'left' }}>
            Pan the map by clicking and dragging, and zoom by using the scroll wheel or map tools.
          </p>
          <p style={{ fontSize: '16px', textAlign: 'left' }}>
            When a collection is selected, the granules will be displayed on the map, along with any available GIBS imagery. When a granule is focused on the map, any additional thumbnails will be displayed.
          </p>
          <div className="tour-buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
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
      placement: 'left',
      styles: {
        tooltip: {
          width: '400px',
          textAlign: 'left',
        },
      },
    },
    {
      target: '.leaflet-bottom.leaflet-right',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            Use the map tools to switch map projections, draw, edit, or remove spatial bounds, zoom the map, or select the base map.
          </p>
          <div className="tour-buttons">
            <Button
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
      placement: 'left',
      styles: {
        tooltip: {
          width: '400px',
        },
        tooltipContent: {
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '1.5',
        },
      },
    },
    {
      target: '.secondary-toolbar__user-dropdown-toggle',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            When logged in, use this menu to set preferences, saved projects, subscriptions, download status and history, or log out.
          </p>
          <div className="tour-buttons">
            <Button
              type="button"
              bootstrapVariant="secondary"
              bootstrapSize="sm"
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Previous
            </Button>
            <Button
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
      },
    },
    {
      target: '.secondary-toolbar__begin-tour-button',
      content: (
        <div>
          <StepCounter currentStep={stepIndex} totalSteps={MAX_STEPS} />
          <p className="tour-content">
            You can replay this tour anytime by clicking <strong>Show Tour</strong>.
          </p>
          <div className="tour-buttons">
            <Button
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
              className="button-tour-finish"
              type="button"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              onClick={() => {
                setStepIndex(stepIndex + 1)
              }}
            >
              Finish Tour
            </Button>

          </div>
        </div>
      ),
      placement: 'right',
      styles: {
        tooltip: {
          width: '400px',
        },
      },
    },
    {
      target: '.search',
      content: (
        <div style={{ textAlign: 'left' }}>
          <h2 className="tour-heading" style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>
            Want to learn more?
          </h2>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            Check out our latest webinar where you will see a hands-on example of how to search for data in Earthdata Search.
          </p>
          <a
            href="https://www.youtube.com/watch?v=QtfMlkd7kII"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#000',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: '0 0 220px', marginRight: '15px' }}>
              <img 
                src={TourThumbnail}
                alt="Webinar Thumbnail"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div>
              <div style={{
                padding: '10px',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                Discover and Access Earth Science Data Using Earthdata Search
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginTop: '10px', marginLeft: '10px' }}>
                Watch the webinar <EDSCIcon icon={FaExternalLinkAlt} />
              </p>
              
            </div>
          </a>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
            Find more information here:
          </p>
          <p>
            <a
              href="https://wiki.earthdata.nasa.gov/display/EDSC/EDSC+Search+Wiki"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#5a585a', textDecoration: 'underline', marginBottom: '5px', display: 'block' }}
            >
              Earthdata Search wiki
            </a>
          </p>
          <p>
            <a
              href="https://www.earthdata.nasa.gov/faq/earthdata-search-faq"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#5a585a', textDecoration: 'underline', display: 'block' }}
            >
              Earthdata Search FAQs
            </a>
          </p>
        </div>
      ),
      disableBeacon: true,
      placement: 'center',
      styles: {
        tooltip: {
          width: '600px',
          padding: '20px',
        },
        tooltipContent: {
          fontSize: '16px',
        },
      },
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data
  
    // Reset tour state when the tour is finished, skipped, paused, or closed
    if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(status) || action === ACTIONS.CLOSE) {
      setRunTour(false)
      setStepIndex(0);
      console.log
    } else if (type === 'step:after' && action === ACTIONS.NEXT) {
      setStepIndex(index + 1)
    } else if (type === 'step:after' && action === ACTIONS.PREV) {
      setStepIndex(index - 1)
    }
  
    // Prevent auto-scrolling within the sidebar component when highlighting
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
          paddingTop: '0px',
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