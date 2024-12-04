import React from 'react'
import {
  FaInfoCircle,
  FaSave,
  FaPlus,
  FaPlay,
  FaQuestion
} from 'react-icons/fa'
import PropTypes from 'prop-types'
import ExternalLink from '../ExternalLink/ExternalLink'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Button from '../Button/Button'
import TourThumbnail from '../../../assets/images/tour-video-thumbnail.png'

import './SearchTour.scss'

const TourButtons = ({
  stepIndex,
  setStepIndex,
  isChecked,
  handleCheckboxChange
}) => (
  <div className="search-tour__footer">
    <div className="search-tour__footer-content">
      <div className="search-tour__tour-toggle-footer">
        <input
          type="checkbox"
          id="dontShowAgain"
          className="search-tour__checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="dontShowAgain" className="search-tour__checkbox__label">
          Don&apos;t show again
        </label>
      </div>
      <div className="search-tour__buttons">
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
  </div>
)

TourButtons.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  setStepIndex: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired
}

const StepCounter = ({ currentStep, totalSteps }) => (
  <p className="step-counter-text">
    {currentStep}
    {' '}
    OF
    {' '}
    {totalSteps}
  </p>
)

StepCounter.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
}

const commonStyles = {
  tooltip: {
    width: '25rem'
  },
  tooltipContent: {
    fontSize: '0.875rem',
    textAlign: 'left',
    lineHeight: '1.5'
  }
}

const TourSteps = ({
  stepIndex,
  setStepIndex,
  setRunTour,
  handleCheckboxChange,
  isChecked,
  loggedIn,
  TOTAL_STEPS
}) => {
  const preSteps = [
    {
      target: '.search',
      content: (
        <div>
          <h2 className="search-tour__welcome">Welcome to Earthdata Search!</h2>
          <p className="search-tour__subheading">Let’s start with a quick tour...</p>
          <p className="search-tour__content">
            Get acquainted with Earthdata Search by taking our guided tour, where you’ll learn
            how to search for data, use the map, create your first project, and manage your
            preferences.
          </p>
          <p className="search-tour__note">
            If you want to skip the tour for now, it is always available by clicking
            {' '}
            <EDSCIcon className="text-icon" icon={FaQuestion} />
            {' '}
            at the top of the page.
          </p>
          <div className="search-tour__tour-toggle">
            <input
              type="checkbox"
              id="dontShowAgain"
              className="search-tour__checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="dontShowAgain" className="search-tour__checkbox__label">
              Don&apos;t show the tour next time I visit Earthdata Search
            </label>
          </div>
          <div className="search-tour__buttons intro">
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
              bootstrapSize="lg"
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
      hideFooter: true,
      placement: 'center'
    },
    {
      target: '.sidebar__inner',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            This area contains the filters used when searching for collections
            (datasets produced by an organization)
            and their granules (sets of files containing data).
          </p>
          <p className="search-tour__content">
            Available filters include keyword search, spatial and temporal bounds,
            and advanced search options.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.search-form__primary',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Search for collections by topic (e.g., &quot;Land Surface Temperature&quot;),
            by collection name, or by CMR Concept ID.
          </p>
          <p className="search-tour__content">
            As you type, suggestions for matching topics and keywords will be
            displayed. When selected, they will be applied as additional search filters.
          </p>
          <div className="search-tour__info-box">
            <p>
              Find more information about the
              {' '}
              <ExternalLink href="https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html">
                Common Metadata Repository (CMR)
              </ExternalLink>
            </p>
          </div>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.temporal-selection-dropdown',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Use the temporal filters to limit search results to a specific date
            and time range.
          </p>
          <p className="search-tour__content">
            A recurring filter can be applied to search a repeating range between
            specified years.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.spatial-selection-dropdown',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Use the spatial filters to limit search results to the specified
            area of interest.
          </p>
          <p className="search-tour__content">
            To set the spatial area using a polygon, rectangle, point and radius,
            or circle, select an option from the menu and then draw on the map
            or manually enter coordinates.
          </p>
          <p className="search-tour__content">
            Upload a shapefile (KML, KMZ, ESRI, etc.) to set the spatial area with
            a file.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.search-form__button--advanced-search',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Use Advanced Search parameters to filter results using features like
            Hydrologic Unit Code (HUC) or SWORD River Reach.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.sidebar-browse-portals',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Choose a portal to refine search results to a particular area of study,
            project, or organization.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      disableScrolling: true,
      styles: commonStyles
    },
    {
      target: '.sidebar-section-body',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Refine your search further using categories like Features, Keywords,
            Platforms, Organizations, etc.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right-start',
      hideFooter: true,
      disableScrolling: true,
      styles: commonStyles
    },
    {
      target: '.panel-section',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            A high-level description is displayed for each search result to help you find
            the right data, including a summary, temporal range, and information about
            capabilities. To view more information about a collection, click the
            {' '}
            <EDSCIcon className="text-icon" icon={FaInfoCircle} />
            {' '}
            icon.
          </p>
          <p className="search-tour__content">
            Add granules to a project and customize options before accessing the data.
            To add a collection to your project, click the
            {' '}
            <EDSCIcon className="text-icon" icon={FaPlus} />
            {' '}
            icon.
            To add individual granules to a project, click on a search result to view and
            add its granules.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles,
      floaterProps: {
        disableFlip: true,
        offset: '0.625rem'
      }
    },
    {
      target: '.panels__handle',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            To make more room to view the map, the search results can be resized by clicking
            or dragging the bar above. The panel can be hidden or shown by clicking the
            handle or using the
            {' '}
            <kbd>]</kbd>
            {' '}
            key.
          </p>
          <div className="search-tour__info-box">
            <p>
              All keyboard shortcuts can be displayed by pressing the
              {' '}
              <kbd>?</kbd>
              {' '}
              key at any time.
            </p>
          </div>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.target-overlay',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Pan the map by clicking and dragging, and zoom by using the scroll wheel or
            map tools.
          </p>
          <p className="search-tour__content">
            When a collection is selected, the granules will be displayed on the map,
            along with any available GIBS imagery. When a granule is focused on the
            map, any additional thumbnails will be displayed.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'left',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.leaflet-bottom.leaflet-right',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Use the map tools to switch map projections, draw, edit, or remove spatial
            bounds, zoom the map, or select the base map.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'left',
      hideFooter: true,
      styles: commonStyles
    }
  ]

  const loggedInSteps = [
    {
      target: '.secondary-toolbar__project-name-dropdown',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Click
            {' '}
            <EDSCIcon className="text-icon" icon={FaSave} />
            {' '}
            to save a project using your current search criteria.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'left',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.secondary-toolbar__user-dropdown-toggle',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Use this menu to set preferences, view saved projects, manage subscriptions,
            view download status and history, or log out.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'left',
      hideFooter: true,
      styles: commonStyles
    }
  ]

  const loggedOutStep = [
    {
      target: '.search',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            Log in with Earthdata Login to set preferences, save projects, create and
            manage subscriptions, and view download status and history.
          </p>
          <TourButtons
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ),
      placement: 'center',
      hideFooter: true,
      styles: commonStyles,
      disableBeacon: true
    }
  ]

  const postSteps = [
    {
      target: '.secondary-toolbar__start-tour-button',
      content: (
        <div className="search-tour__content-wrapper">
          <StepCounter currentStep={stepIndex} totalSteps={TOTAL_STEPS} />
          <p className="search-tour__content">
            You can replay this tour anytime by clicking
            {' '}
            <EDSCIcon className="text-icon" icon={FaQuestion} />
          </p>
          <div className="search-tour__footer">
            <div className="search-tour__footer-content">
              <div className="search-tour__tour-toggle-footer">
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  className="search-tour__checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="dontShowAgain" className="search-tour__checkbox__label">
                  Don&apos;t show again
                </label>
              </div>
              <div className="search-tour__buttons">
                <Button
                  type="button"
                  bootstrapVariant="secondary"
                  bootstrapSize="sm"
                  onClick={() => setStepIndex(stepIndex - 1)}
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
          </div>
        </div>
      ),
      placement: 'right',
      hideFooter: true,
      styles: commonStyles
    },
    {
      target: '.search',
      content: (
        <div>
          <h2 className="search-tour__heading">
            Want to learn more?
          </h2>
          <p className="search-tour__webinar-description">
            Check out our latest webinar where you will see a hands-on example of
            how to search for data in Earthdata Search.
          </p>
          <a className="search-tour__webinar-link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=QtfMlkd7kII">
            <div className="search-tour__webinar-text">
              <div className="search-tour__webinar-thumbnail-wrapper">
                <div className="search-tour__webinar-thumbnail-overlay">
                  <div className="search-tour__webinar-thumbnail-icon-bg">
                    <EDSCIcon className="search-tour__webinar-thumbnail-icon" size="18px" icon={FaPlay} />
                  </div>
                </div>
                <img
                  className="search-tour__webinar-thumbnail"
                  src={TourThumbnail}
                  alt="Webinar Thumbnail"
                />
              </div>
            </div>
            <div className="search-tour__webinar-content">
              <div className="search-tour__webinar-discover-more">
                Discover and Access Earth Science Data Using Earthdata Search
              </div>
              <p className="search-tour__webinar-inner-link">
                <ExternalLink innerLink>
                  Watch the webinar on YouTube
                </ExternalLink>
              </p>
            </div>
          </a>
          <p className="search-tour__more-info">
            Find more information here:
          </p>
          <ul className="search-tour__earthdata-list">
            <li>
              <ExternalLink
                href="https://www.earthdata.nasa.gov/learn/earthdata-search"
              >
                Earthdata Search
              </ExternalLink>
            </li>
          </ul>
          <div className="search-tour__tour-toggle">
            <input
              type="checkbox"
              id="dontShowAgain"
              className="search-tour__checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="dontShowAgain" className="search-tour__checkbox__label">
              Don&apos;t show the tour next time I visit Earthdata Search
            </label>
          </div>
        </div>
      ),
      hideFooter: true,
      disableBeacon: true,
      placement: 'center',
      styles: {
        tooltip: {
          width: '37.5rem',
          padding: '1.25rem'
        },
        tooltipContent: {
          fontSize: '1rem'
        }
      }
    }
  ]

  return [
    ...preSteps,
    ...(loggedIn ? loggedInSteps : loggedOutStep),
    ...postSteps
  ]
}

export default TourSteps
