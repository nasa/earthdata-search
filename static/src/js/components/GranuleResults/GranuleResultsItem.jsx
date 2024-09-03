import React, { forwardRef } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { LinkContainer } from 'react-router-bootstrap'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import {
  Minus,
  Plus,
  XCircled
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import murmurhash3 from '../../util/murmurhash3'
import { locationPropType } from '../../util/propTypes/location'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EDSCImage from '../EDSCImage/EDSCImage'
import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import './GranuleResultsItem.scss'

/**
 * Renders GranuleResultsItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - Granule passed from redux store.
 * @param {Object} props.directDistributionInformation - The collection direct distribution information.
 * @param {Object} props.granule - Granule passed from redux store.
 * @param {Boolean} props.isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Function} props.isGranuleInProject - Function designating if the granule is in the project.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to focus a granule.
 * @param {Function} props.onMetricsDataAccess - Callback to capture data access metrics.
 * @param {Function} props.onRemoveGranuleFromProjectCollection - Callback to remove a granule to the project.
 */
const GranuleResultsItem = forwardRef(({
  collectionId,
  directDistributionInformation,
  granule,
  isCollectionInProject,
  isGranuleInProject,
  location,
  onAddGranuleToProjectCollection,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  onRemoveGranuleFromProjectCollection
}, ref) => {
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
      element = (
        <EDSCImage
          className="granule-results-item__thumb-image"
          src={granuleThumbnail}
          height={thumbnailHeight}
          width={thumbnailWidth}
          alt={`Browse Image for ${title}`}
          useSpinner={false}
          isBase64Image
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

  const itemTitle = {
    title: 'Focus granule on map'
  }

  if (isFocusedGranule) itemTitle.title = 'Unfocus granule on map'

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
                        label="Add granule"
                        title="Add granule"
                        disabled={isOpenSearch}
                        onClick={
                          (event) => {
                            onAddGranuleToProjectCollection({
                              collectionId,
                              granuleId: id
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
                        label="Remove granule"
                        title="Remove granule"
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
                    collectionId={collectionId}
                    dataLinks={dataLinks}
                    directDistributionInformation={directDistributionInformation}
                    s3Links={s3Links}
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

GranuleResultsItem.displayName = 'GranuleResultsItem'

GranuleResultsItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
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
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired
}

export default GranuleResultsItem
