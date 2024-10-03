import React from 'react'
import { FaInfoCircle, FaPlus } from 'react-icons/fa'
import PropTypes from 'prop-types'
import ExternalLink from '../ExternalLink/ExternalLink'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Button from '../Button/Button'
import TourThumbnail from '../../../assets/images/tour-video-thumbnail.png'

export const TOTAL_STEPS = 12

const TourButtons = ({ stepIndex, setStepIndex }) => (
  <div className="tour-buttons">
    <Button
      type="button"
      bootstrapVariant="secondary"
      bootstrapSize="sm"
      data-testid="tour-previous-button"
      onClick={() => setStepIndex(stepIndex - 1)}
    >
      Previous
    </Button>
    <Button
      type="button"
      bootstrapVariant="primary"
      bootstrapSize="sm"
      data-testid="tour-next-button"
      onClick={() => setStepIndex(stepIndex + 1)}
    >
      Next
    </Button>
  </div>
)

TourButtons.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  setStepIndex: PropTypes.func.isRequired
}

const StepCounter = ({ currentStep }) => (
  <p className="step-counter-text">
    {currentStep}
    {' '}
    OF
    {' '}
    {TOTAL_STEPS}
  </p>
)

StepCounter.propTypes = {
  currentStep: PropTypes.number.isRequired
}

const TourSteps = (stepIndex, setStepIndex, setRunTour) => [
  {
    target: '.search',
    content: (
      <div>
        <h2 className="tour-heading">Welcome to Earthdata Search!</h2>
        <p className="tour-subheading">Let’s start with a quick tour...</p>
        <p className="tour-content">
          Get acquainted with Earthdata Search by taking our guided tour, where you’ll learn
          how to search for data, use the map, create your first project, and manage your
          preferences.
        </p>
        <p className="tour-note">
          If you want to skip the tour for now, it is always available by clicking
          {' '}
          <strong>Show Tour</strong>
          {' '}
          at the top of the page.
        </p>
        <div className="tour-intro-buttons">
          <Button
            className="button-tour-start"
            type="button"
            bootstrapVariant="primary"
            bootstrapSize="lg"
            onClick={
              () => {
                setStepIndex(stepIndex + 1)
              }
            }
          >
            Take the tour
          </Button>
          <Button
            className="button-tour-skip"
            type="button"
            bootstrapVariant="secondary"
            bootstrapSize="sm"
            onClick={
              () => {
                setRunTour(false)
                setStepIndex(0)
              }
            }
          >
            Skip for now
          </Button>
        </div>
      </div>
    ),
    disableBeacon: true,
    placement: 'center'
  },
  {
    target: '.sidebar__inner',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          This area contains the filters used when searching for collections
          (datasets produced by an organization)
          and their granules (sets of files containing data).
        </p>
        <p className="tour-content">
          Available filters include keyword search, spatial and temporal bounds,
          and advanced search options.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.search-form__primary',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Search for collections by topic (e.g., &quot;Land Surface Temperature&quot;),
          by collection name, or by CMR Concept ID.
        </p>
        <p className="tour-content">
          As you type, suggestions for matching topics and keywords will be
          displayed. When selected, they will be applied as additional search filters.
        </p>
        <div className="tour-info-box">
          <p>
            Find more information about the
            {' '}
            <ExternalLink href="https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html">
              Common Metadata Repository (CMR)
            </ExternalLink>
          </p>
        </div>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.temporal-selection-dropdown',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Use the temporal filters to limit search results to a specific date
          and time range.
        </p>
        <p className="tour-content">
          A recurring filter can be applied to search a repeating range between
          specified years.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.spatial-selection-dropdown',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Use the spatial filters to limit search results to the specified
          area of interest.
        </p>
        <p className="tour-content">
          To set the spatial area using a polygon, rectangle, point and radius,
          or circle, select an option from the menu and then draw on the map
          or manually enter coordinates.
        </p>
        <p className="tour-content">
          Upload a shapefile (KML, KMZ, ESRI, etc.) to set the spatial area with
          a file.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.search-form__button--advanced-search',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Use Advanced Search parameters to filter results using features like
          Hydrologic Unit Code (HUC) or SWORD River Reach.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.sidebar-browse-portals',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Choose a portal to refine search results to a particular area of study,
          project, or organization.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    disableScrolling: true,
    styles: {
      tooltip: {
        width: '400px'
      }
    }
  },
  {
    target: '.sidebar-section-body',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Refine your search further using categories like Features, Keywords,
          Platforms, Organizations, etc.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right-start',
    disableScrolling: true,
    styles: {
      tooltip: {
        width: '400px'
      }
    }
  },
  {
    target: '.panel-section',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          A high-level description is displayed for each search result to help you find
          the right data, including a summary, temporal range, and information about
          capabilities. To view more information about a collection, click the
          {' '}
          <EDSCIcon className="text-icon" icon={FaInfoCircle} />
          {' '}
          icon.
        </p>
        <p className="tour-content">
          Add granules to a project and customize options before accessing the data.
          To add a collection to your project, click the
          {' '}
          <EDSCIcon className="text-icon" icon={FaPlus} />
          {' '}
          icon.
          To add individual granules to a project, click on a search result to view and
          add its granules.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      }
    },
    floaterProps: {
      disableFlip: true,
      offset: 10
    }
  },
  {
    target: '.panels__handle',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          To make more room to view the map, the search results can be resized by clicking
          or dragging the bar above. The panel can be hidden or shown by clicking the
          handle or using the
          {' '}
          <kbd>]</kbd>
          {' '}
          key.
        </p>
        <div className="tour-info-box">
          <p>
            All keyboard shortcuts can be displayed by pressing the
            {' '}
            <kbd>?</kbd>
            {' '}
            key at any time.
          </p>
        </div>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      }
    }
  },
  {
    target: '.right-overlay',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p style={
          {
            fontSize: '16px',
            textAlign: 'left'
          }
        }
        >
          Pan the map by clicking and dragging, and zoom by using the scroll wheel or
          map tools.
        </p>
        <p style={
          {
            fontSize: '16px',
            textAlign: 'left'
          }
        }
        >
          When a collection is selected, the granules will be displayed on the map,
          along with any available GIBS imagery. When a granule is focused on the
          map, any additional thumbnails will be displayed.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'left',
    styles: {
      tooltip: {
        width: '400px',
        textAlign: 'left'
      }
    }
  },
  {
    target: '.leaflet-bottom.leaflet-right',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          Use the map tools to switch map projections, draw, edit, or remove spatial
          bounds, zoom the map, or select the base map.
        </p>
        <TourButtons stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    ),
    placement: 'left',
    styles: {
      tooltip: {
        width: '400px'
      },
      tooltipContent: {
        fontSize: '14px',
        textAlign: 'left',
        lineHeight: '1.5'
      }
    }
  },
  {
    target: '.secondary-toolbar__begin-tour-button',
    content: (
      <div>
        <StepCounter currentStep={stepIndex} />
        <p className="tour-content">
          You can replay this tour anytime by clicking
          {' '}
          <strong>Show Tour</strong>
          .
        </p>
        <div className="tour-buttons">
          <Button
            type="button"
            bootstrapVariant="secondary"
            bootstrapSize="sm"
            onClick={
              () => {
                setStepIndex(stepIndex - 1)
              }
            }
          >
            Previous
          </Button>
          <Button
            className="button-tour-finish"
            type="button"
            bootstrapVariant="primary"
            bootstrapSize="sm"
            onClick={
              () => {
                setStepIndex(stepIndex + 1)
              }
            }
          >
            Finish Tour
          </Button>
        </div>
      </div>
    ),
    placement: 'right',
    styles: {
      tooltip: {
        width: '400px'
      }
    }
  },
  {
    target: '.search',
    content: (
      <div style={{ textAlign: 'left' }}>
        <h2
          className="tour-heading"
          style={
            {
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }
          }
        >
          Want to learn more?
        </h2>
        <p style={
          {
            marginBottom: '20px',
            fontSize: '16px'
          }
        }
        >
          Check out our latest webinar where you will see a hands-on example of
          how to search for data in Earthdata Search.
        </p>
        <div
          style={
            {
              backgroundColor: '#f5f5f5',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#000',
              display: 'flex',
              alignItems: 'center'
            }
          }
        >
          <div style={
            {
              flex: '0 0 220px',
              marginRight: '15px'
            }
          }
          >
            <img
              src={TourThumbnail}
              alt="Webinar Thumbnail"
              style={
                {
                  width: '100%',
                  height: 'auto'
                }
              }
            />
          </div>
          <div>
            <div style={
              {
                padding: '10px',
                fontSize: '16px',
                fontWeight: '500'
              }
            }
            >
              Discover and Access Earth Science Data Using Earthdata Search
            </div>
            <p style={
              {
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px',
                marginLeft: '10px'
              }
            }
            >
              <ExternalLink href="https://www.youtube.com/watch?v=QtfMlkd7kII">
                Watch the webinar
              </ExternalLink>
            </p>
          </div>
        </div>
        <p style={
          {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '5px'
          }
        }
        >
          Find more information here:
        </p>
        <p>
          <a
            href="https://www.earthdata.nasa.gov/learn/earthdata-search"
            target="_blank"
            rel="noopener noreferrer"
            style={
              {
                color: '#5a585a',
                textDecoration: 'underline',
                marginBottom: '5px',
                display: 'block'
              }
            }
          >
            Earthdata Search wiki
          </a>
        </p>
        <p>
          <a
            href="https://www.earthdata.nasa.gov/faq/earthdata-search-faq"
            target="_blank"
            rel="noopener noreferrer"
            style={
              {
                color: '#5a585a',
                textDecoration: 'underline',
                display: 'block'
              }
            }
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
        padding: '20px'
      },
      tooltipContent: {
        fontSize: '16px'
      }
    }
  }
]

export default TourSteps
