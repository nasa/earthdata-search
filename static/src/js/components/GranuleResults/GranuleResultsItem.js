import React, { forwardRef } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import { LinkContainer } from 'react-router-bootstrap'

import murmurhash3 from '../../util/murmurhash3'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { portalPath } from '../../../../../sharedUtils/portalPath'

import Button from '../Button/Button'
import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'

import './GranuleResultsItem.scss'
import { authenticationEnabled } from '../../util/portals'

const thumbnailHeight = getApplicationConfig().thumbnailSize.height
const thumbnailWidth = getApplicationConfig().thumbnailSize.width

/**
 * Renders GranuleResultsItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - Granule passed from redux store.
 * @param {Object} props.granule - Granule passed from redux store.
 * @param {Boolean} props.isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Function} props.isGranuleInProject - Function designating if the granule is in the project.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to focus a granule.
 * @param {Function} props.onMetricsDataAccess - Callback to capture data access metrics.
 * @param {Function} props.onRemoveGranuleFromProjectCollection - Callback to remove a granule to the project.
 * @param {Object} props.portal - Portal object passed from the store.
 */
const GranuleResultsItem = forwardRef(({
  collectionId,
  granule,
  isCollectionInProject,
  isGranuleInProject,
  location,
  onAddGranuleToProjectCollection,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  onRemoveGranuleFromProjectCollection,
  portal
}, ref) => {
  const handleFilterClick = () => {
    let { id } = granule
    const { is_cwic: isCwic } = granule

    if (isCwic) id = murmurhash3(id).toString()
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
    isFocusedGranule,
    onlineAccessFlag,
    timeEnd,
    timeStart,
    title
  } = granule

  const buildThumbnail = () => {
    let element = null

    if (granuleThumbnail) {
      element = (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          className="granule-results-item__thumb-image"
          src={granuleThumbnail}
          height={thumbnailHeight}
          width={thumbnailWidth}
          alt={`Browse Image for ${title}`}
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

  const enhancedHandleOnClick = (e) => {
    // Only fire the click event on the row if no text is currently selected
    if (textSelectionFlag) return
    handleClick(e)
  }

  const itemTitle = {
    title: 'Focus granule on map'
  }

  if (isFocusedGranule) itemTitle.title = 'Unfocus granule on map'

  const isInProject = isGranuleInProject(id)

  const granuleResultsItemClasses = classNames([
    'granule-results-item',
    {
      'granule-results-item--selected': isFocusedGranule,
      'granule-results-item--emphisized': isCollectionInProject && isInProject,
      'granule-results-item--deemphisized': isCollectionInProject && !isInProject
    }
  ])

  return (
    <div
      ref={ref}
      className={granuleResultsItemClasses}
      tabIndex={0}
      role="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={enhancedOnRowMouseUp}
      onKeyPress={handleClick}
      onClick={enhancedHandleOnClick}
      {...itemTitle}
    >
      <header
        className="granule-results-item__header"
      >
        <div
          className="granule-results-item__title-wrapper"
        >
          <h3
            className="granule-results-item__title"
          >
            {title}
          </h3>
        </div>
        <MoreActionsDropdown
          className="granule-results-item__more-actions-dropdown"
        >
          <LinkContainer
            onClick={() => handleClickGranuleDetails(id)}
            to={{
              pathname: `${portalPath(portal)}/search/granules/granule-details`,
              search: location.search
            }}
          >
            <MoreActionsDropdownItem
              title="View details"
              icon="info-circle"
            />
          </LinkContainer>
          <MoreActionsDropdownItem
            title="Filter granule"
            icon="times-circle"
            onClick={handleFilterClick}
          />
        </MoreActionsDropdown>
      </header>
      <div className="granule-results-item__body">
        {browseFlag && buildThumbnail()}
        <div className="granule-results-item__meta">
          <div className="granule-results-item__temporal granule-results-item__temporal--start">
            <h5>Start</h5>
            <p>{timeStart}</p>
          </div>
          <div className="granule-results-item__temporal granule-results-item__temporal--end">
            <h5>End</h5>
            <p>{timeEnd}</p>
          </div>
          <div className="granule-results-item__actions">
            <div className="granule-results-item__buttons">
              {
                authenticationEnabled(portal) && (
                  <>
                    {
                      !isInProject
                        ? (
                          <Button
                            className="button granule-results-item__button granule-results-item__button--add"
                            label="Add granule"
                            title="Add granule"
                            onClick={(e) => {
                              onAddGranuleToProjectCollection({
                                collectionId,
                                granuleId: id
                              })

                              // Prevent clicks from bubbling up to other granule item events.
                              e.stopPropagation()
                            }}
                          >
                            <i className="fa fa-plus" />
                          </Button>
                        )
                        : (
                          <Button
                            className="button granule-results-item__button granule-results-item__button--remove"
                            label="Remove granule"
                            title="Remove granule"
                            onClick={(e) => {
                              onRemoveGranuleFromProjectCollection({
                                collectionId,
                                granuleId: id
                              })

                              // Prevent clicks from bubbling up to other granule item events.
                              e.stopPropagation()
                            }}
                          >
                            <i className="fa fa-minus" />
                          </Button>
                        )
                    }
                  </>
                )
              }
              {
                onlineAccessFlag && (
                  <GranuleResultsDataLinksButton
                    collectionId={collectionId}
                    dataLinks={dataLinks}
                    onMetricsDataAccess={onMetricsDataAccess}
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

GranuleResultsItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granule: PropTypes.shape({}).isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default GranuleResultsItem
