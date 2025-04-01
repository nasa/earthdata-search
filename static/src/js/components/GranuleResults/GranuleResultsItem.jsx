import React, { forwardRef } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { LinkContainer } from 'react-router-bootstrap'

import Highlighter from 'react-highlight-words'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import {
  Minus,
  Plus,
  XCircled
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { getValueForTag } from '../../../../../sharedUtils/tags'
import { getSearchWords } from '../../util/getSearchWords'

import murmurhash3 from '../../util/murmurhash3'
import { locationPropType } from '../../util/propTypes/location'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EDSCImage from '../EDSCImage/EDSCImage'
import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import GranuleResultsDownloadNotebookButton from './GranuleResultsDownloadNotebookButton'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import './GranuleResultsItem.scss'

/**
 * Renders GranuleResultsItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - Granule passed from redux store.
 * @param {Object} props.collectionQuerySpatial - The spatial for the collection query
 * @param {Object} props.collectionTags - The tags for the focused collection
 * @param {Object} props.directDistributionInformation - The collection direct distribution information.
 * @param {Object} props.generateNotebook - The generateNotebook state from the redux store.
 * @param {Object} props.granule - Granule passed from redux store.
 * @param {Boolean} props.isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Function} props.isGranuleInProject - Function designating if the granule is in the project.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to focus a granule.
 * @param {Function} props.onGenerateNotebook - Callback to generate a notebook.
 * @param {Function} props.onMetricsDataAccess - Callback to capture data access metrics.
 * @param {Function} props.onMetricsAddGranuleProject - Metrics callback for adding granule to project event.
 * @param {Function} props.onRemoveGranuleFromProjectCollection - Callback to remove a granule to the project.
 * @param {Array} props.readableGranuleName - Array of Readable Granule Name strings.
 */
const GranuleResultsItem = forwardRef(({
  collectionId,
  collectionQuerySpatial,
  collectionTags,
  directDistributionInformation,
  generateNotebook,
  granule,
  isCollectionInProject,
  isGranuleInProject,
  location,
  onAddGranuleToProjectCollection,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  onMetricsAddGranuleProject,
  onGenerateNotebook,
  onRemoveGranuleFromProjectCollection,
  readableGranuleName
}, ref) => {
  const generateNotebookTag = getValueForTag('notebook_generation', collectionTags)
  const { thumbnailSize } = getApplicationConfig()
  const {
    height: thumbnailHeight,
    width: thumbnailWidth
  } = thumbnailSize

  const handleFilterClick = () => {
    let { id } = granule

    const { isOpenSearch } = granule

    if (isOpenSearch) id = murmurhash3(id).toString()

    onExcludeGranule({
      collectionId,
      granuleId: id
    })
  }

  const handleClickGranuleDetails = (granuleId) => {
    onFocusedGranuleChange(granuleId)
  }

  const {
    browseFlag,
    browseUrl,
    dataLinks,
    granuleThumbnail,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    id,
    isHoveredGranule,
    isFocusedGranule,
    isOpenSearch,
    onlineAccessFlag,
    s3Links,
    timeEnd = 'Not Provided',
    timeStart = 'Not Provided',
    title
  } = granule

  const buildThumbnail = () => {
    let element = null
    if (granuleThumbnail) {
      // Only resize image if it is not an opensearch granule
      const shouldResizeImage = !isOpenSearch
      element = (
        <EDSCImage
          className="granule-results-item__thumb-image"
          src={granuleThumbnail}
          height={thumbnailHeight}
          width={thumbnailWidth}
          alt={`Browse Image for ${title}`}
          useSpinner={false}
          resizeImage={shouldResizeImage}
        />
      )

      if (browseUrl) {
        element = (
          <a
            className="granule-results-item__thumb"
            href={browseUrl}
            title="View image"
            target="_blank"
            rel="noopener noreferrer"
          >
            {element}
          </a>
        )
      } else {
        element = (
          <div className="granule-results-item__thumb">
            {element}
          </div>
        )
      }
    }

    return element
  }

  let textSelectionFlag = false

  const enhancedOnRowMouseUp = () => {
    textSelectionFlag = false

    // Check the window to see if any text is currently selected.
    if (window.getSelection().toString().length > 0) {
      textSelectionFlag = true
    }
  }

  const enhancedHandleOnClick = (event) => {
    // Only fire the click event on the row if no text is currently selected
    if (textSelectionFlag) return
    handleClick(event)
  }

  const isInProject = isGranuleInProject(id)

  const granuleResultsItemClasses = classNames([
    'granule-results-item',
    {
      'granule-results-item--active': isFocusedGranule || isHoveredGranule,
      'granule-results-item--emphisized': isCollectionInProject && isInProject,
      'granule-results-item--deemphisized': isCollectionInProject && !isInProject,
      'granule-results-item--has-thumbnail': browseFlag
    }
  ])

  return (
    <div
      className={granuleResultsItemClasses}
      data-testid="granule-results-item"
      onClick={enhancedHandleOnClick}
      onKeyPress={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={enhancedOnRowMouseUp}
      ref={ref}
      role="button"
      tabIndex={0}
      // eslint-disable-next-line react/jsx-props-no-spreading
    >
      <header
        className="granule-results-item__header"
      >
        <div
          className="granule-results-item__title-wrapper"
        >
          <h3
            className="granule-results-item__title h6"
          >
            <Highlighter
              highlightClassName="granule-results-item__highlighted-title"
              searchWords={getSearchWords(readableGranuleName)}
              textToHighlight={title}
            />
          </h3>
        </div>
        <MoreActionsDropdown
          className="granule-results-item__more-actions-dropdown"
        >
          <LinkContainer
            onClick={() => handleClickGranuleDetails(id)}
            to={
              {
                pathname: '/search/granules/granule-details',
                search: location.search
              }
            }
          >
            <MoreActionsDropdownItem
              title="View details"
              icon={AlertInformation}
            />
          </LinkContainer>
          <MoreActionsDropdownItem
            title="Filter granule"
            icon={XCircled}
            onClick={handleFilterClick}
          />
        </MoreActionsDropdown>
      </header>
      <div className="granule-results-item__body">
        {browseFlag && buildThumbnail()}
        <div className="granule-results-item__meta">
          <div className="granule-results-item__temporal granule-results-item__temporal--start">
            <h5>Start</h5>
            <p>{timeStart || <>&ndash;</>}</p>
          </div>
          <div className="granule-results-item__temporal granule-results-item__temporal--end">
            <h5>End</h5>
            <p>{timeEnd || <>&ndash;</>}</p>
          </div>
          <div className="granule-results-item__actions">
            <div className="granule-results-item__buttons">
              <PortalFeatureContainer authentication>
                {
                  !isInProject
                    ? (
                      <Button
                        className="button granule-results-item__button granule-results-item__button--add"
                        tooltip="Add granule to project"
                        ariaLabel="Add granule to project"
                        tooltipId={`add-granule-tooltip-${id}`}
                        disabled={isOpenSearch}
                        onClick={
                          (event) => {
                            onAddGranuleToProjectCollection({
                              collectionId,
                              granuleId: id
                            })

                            onMetricsAddGranuleProject({
                              collectionConceptId: collectionId,
                              granuleConceptId: id,
                              page: 'granules',
                              view: 'list'
                            })

                            // Prevent clicks from bubbling up to other granule item events.
                            event.stopPropagation()
                          }
                        }
                      >
                        <EDSCIcon icon={Plus} />
                      </Button>
                    )
                    : (
                      <Button
                        className="button granule-results-item__button granule-results-item__button--remove"
                        tooltip="Remove granule from project"
                        tooltipId={`remove-granule-tooltip-${id}`}
                        ariaLabel="Remove granule from project"
                        onClick={
                          (event) => {
                            onRemoveGranuleFromProjectCollection({
                              collectionId,
                              granuleId: id
                            })

                            // Prevent clicks from bubbling up to other granule item events.
                            event.stopPropagation()
                          }
                        }
                      >
                        <EDSCIcon icon={Minus} />
                      </Button>
                    )
                }
              </PortalFeatureContainer>
              {
                onlineAccessFlag && (
                  <GranuleResultsDataLinksButton
                    id={id}
                    collectionId={collectionId}
                    dataLinks={dataLinks}
                    directDistributionInformation={directDistributionInformation}
                    s3Links={s3Links}
                    onMetricsDataAccess={onMetricsDataAccess}
                  />
                )
              }
              {
                generateNotebookTag && (
                  <GranuleResultsDownloadNotebookButton
                    collectionQuerySpatial={collectionQuerySpatial}
                    granuleId={id}
                    generateNotebook={generateNotebook}
                    generateNotebookTag={generateNotebookTag}
                    onGenerateNotebook={onGenerateNotebook}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

GranuleResultsItem.displayName = 'GranuleResultsItem'

GranuleResultsItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collectionQuerySpatial: PropTypes.shape({}).isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granule: PropTypes.shape({
    id: PropTypes.string,
    isOpenSearch: PropTypes.bool,
    browseFlag: PropTypes.bool,
    browseUrl: PropTypes.string,
    dataLinks: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    granuleThumbnail: PropTypes.string,
    handleClick: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    isHoveredGranule: PropTypes.bool,
    isFocusedGranule: PropTypes.bool,
    onlineAccessFlag: PropTypes.bool,
    s3Links: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    timeEnd: PropTypes.string,
    timeStart: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  location: locationPropType.isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  readableGranuleName: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default GranuleResultsItem
