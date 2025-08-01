import React, {
  forwardRef,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import {
  CloudFill,
  Minus,
  Plus,
  Settings
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import {
  FaClock,
  FaLock,
  FaMap
} from 'react-icons/fa'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import { commafy } from '../../util/commafy'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../util/pluralize'
import { retrieveThumbnail } from '../../util/retrieveThumbnail'

import Button from '../Button/Button'
import AvailableCustomizationsIcons from '../AvailableCustomizationsIcons/AvailableCustomizationsIcons'
import AvailableCustomizationsTooltipIcons from '../AvailableCustomizationsIcons/AvailableCustomizationsTooltipIcons'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import MetaIcon from '../MetaIcon/MetaIcon'
import Spinner from '../Spinner/Spinner'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import useEdscStore from '../../zustand/useEdscStore'

import './CollectionResultsItem.scss'

/**
 * Renders CollectionResultsItem.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collection - The collection metadata.
 * @param {Function} props.onMetricsAddCollectionProject - Metrics callback for adding a collection to project event.
 * @param {Function} props.onViewCollectionGranules - Callback to show collection granules route.
 * @param {Function} props.onViewCollectionDetails - Callback to show collection details route.
 */
export const CollectionResultsItem = forwardRef(({
  collectionMetadata,
  onMetricsAddCollectionProject,
  onViewCollectionDetails,
  onViewCollectionGranules
}, ref) => {
  const {
    addProjectCollection,
    removeProjectCollection
  } = useEdscStore((state) => ({
    addProjectCollection: state.project.addProjectCollection,
    removeProjectCollection: state.project.removeProjectCollection
  }))

  const {
    collectionId,
    consortiums = [],
    cloudHosted,
    datasetId,
    displayOrganization,
    granuleCount,
    hasFormats,
    hasCombine,
    hasMapImagery,
    hasSpatialSubsetting,
    hasTemporalSubsetting,
    hasTransforms,
    hasVariables,
    isCollectionInProject,
    isCSDA,
    isNrt,
    isOpenSearch,
    nrt = {},
    shortName,
    summary,
    temporalRange,
    thumbnail,
    isDefaultImage,
    versionId
  } = collectionMetadata

  const [loadingThumbnail, setLoadingThumbnail] = useState(true)
  const { thumbnailSize } = getApplicationConfig()
  const [base64Image, setBase64Image] = useState('')

  const {
    height: thumbnailHeight,
    width: thumbnailWidth
  } = thumbnailSize

  const consortiumMeta = {
    GEOSS: 'Global Earth Observation System of Systems',
    CWIC: 'CEOS WGISS Integrated Catalog',
    FEDEO: 'Federated EO Gateway',
    CEOS: 'Committee on Earth Observation Satellites'
  }

  const { description: nrtDescription, label: nrtLabel } = nrt

  const onThumbnailLoaded = () => {
    setLoadingThumbnail(false)
  }

  const parseScaleImageResponse = async () => {
    if (!isDefaultImage) {
      const thumbnailValue = await retrieveThumbnail(thumbnail)
      setBase64Image(thumbnailValue)
      onThumbnailLoaded()
    } else {
      // Passed in thumbnail was the default set `base64` image to that
      // If the thumbnail was null set it to the unavailable image
      setBase64Image(thumbnail)
      onThumbnailLoaded()
    }
  }

  // Fetch the base64 string from the Lambda function
  // Explicity call the GET request for the lambda
  useEffect(() => {
    parseScaleImageResponse()
  }, [])

  const getConsortiumTooltipText = (consortium) => {
    let tooltip = ''
    if (consortiumMeta[consortium]) tooltip = consortiumMeta[consortium]

    return tooltip
  }

  const filteredConsortiums = consortiums.filter((consortium) => consortium !== 'EOSDIS')

  const addToProjectButton = (
    <Button
      className="collection-results-item__action collection-results-item__action--add"
      onClick={
        (event) => {
          addProjectCollection(collectionId)
          onMetricsAddCollectionProject({
            collectionConceptId: collectionId,
            view: 'list',
            page: 'collections'
          })

          event.stopPropagation()
        }
      }
      variant="light"
      bootstrapVariant="light"
      bootstrapSize="sm"
      icon={Plus}
      label="Add collection to the current project"
      title="Add collection to the current project"
    />
  )

  const removeFromProjectButton = (
    <Button
      className="collection-results-item__action collection-results-item__action--remove"
      onClick={
        (event) => {
          removeProjectCollection(collectionId)
          event.stopPropagation()
        }
      }
      variant="light"
      bootstrapVariant="light"
      bootstrapSize="sm"
      icon={Minus}
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    />
  )

  const availableCustomizationsIcons = (
    <AvailableCustomizationsIcons
      hasSpatialSubsetting={hasSpatialSubsetting}
      hasVariables={hasVariables}
      hasTransforms={hasTransforms}
      hasFormats={hasFormats}
      hasTemporalSubsetting={hasTemporalSubsetting}
      hasCombine={hasCombine}
    />
  )

  const availableCustomizationsTooltipIcons = (
    <AvailableCustomizationsTooltipIcons
      hasSpatialSubsetting={hasSpatialSubsetting}
      hasVariables={hasVariables}
      hasTransforms={hasTransforms}
      hasFormats={hasFormats}
      hasTemporalSubsetting={hasTemporalSubsetting}
      hasCombine={hasCombine}
    />
  )

  const supportsDataCustomizations = hasSpatialSubsetting
    || hasVariables
    || hasTransforms
    || hasFormats
    || hasTemporalSubsetting
    || hasCombine

  const component = (
    <div
      className="collection-results-item"
      data-testid="collection-results-item"
      key={collectionId}
      ref={ref}
    >
      <div
        role="button"
        tabIndex="0"
        className="collection-results-item__link"
        onKeyPress={
          (event) => {
            if (event.key === 'Enter') {
              onViewCollectionGranules(collectionId)
            }

            event.stopPropagation()
          }
        }
        onClick={
          (event) => {
            onViewCollectionGranules(collectionId)
            event.stopPropagation()
          }
        }
        data-testid={`collection-result-item_${collectionId}`}
      >
        <div className="collection-results-item__body">
          <div className="collection-results-item__body-primary">
            <div className="collection-results-item__info">
              <h3 className="collection-results-item__title">
                {datasetId}
              </h3>
              <div className="collection-results-item__meta">
                {
                  isOpenSearch && (
                    <span className="collection-results-item__meta-item">Int&apos;l / Interagency</span>
                  )
                }
                {
                  !isOpenSearch && (
                    <span className="collection-results-item__meta-item">{`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}</span>
                  )
                }
                {
                  temporalRange && (
                    <span className="collection-results-item__meta-item">{temporalRange}</span>
                  )
                }
                {
                  cloudHosted && (
                    <MetaIcon
                      id="feature-icon-list-view__earthdata-cloud"
                      icon={CloudFill}
                      iconProps={{ size: '1rem' }}
                      label="Earthdata Cloud"
                      tooltipClassName="collection-results-item__tooltip"
                      tooltipContent="Dataset is available in the Earthdata Cloud"
                    />
                  )
                }
                {
                  !cloudHosted && (
                    <MetaIcon
                      id="feature-icon-list-view__earthdata-cloud"
                      icon={CloudFill}
                      iconProps={{ size: '1rem' }}
                      label="Not hosted in Earthdata Cloud"
                      notAvailable
                      tooltipClassName="collection-results-item__tooltip"
                      tooltipContent="Dataset is not available in the Earthdata Cloud"
                    />
                  )
                }
                {
                  supportsDataCustomizations && (
                    <MetaIcon
                      id="feature-icon-list-view__customize"
                      icon={Settings}
                      label="Customize"
                      tooltipClassName="collection-results-item__tooltip text-align-left"
                      tooltipContent={availableCustomizationsTooltipIcons}
                      metadata={availableCustomizationsIcons}
                    />
                  )
                }
                {
                  !supportsDataCustomizations && (
                    <MetaIcon
                      id="feature-icon-list-view__customize"
                      icon={Settings}
                      label="No customizations"
                      notAvailable
                      tooltipClassName="collection-results-item__tooltip text-align-left"
                      tooltipContent="No customization support"
                    />
                  )
                }
                {
                  hasMapImagery && (
                    <MetaIcon
                      id="feature-icon-list-view__map-imagery"
                      icon={FaMap}
                      iconProps={{ size: '15' }}
                      label="Map Imagery"
                      tooltipClassName="collection-results-item__tooltip"
                      tooltipContent="Supports advanced map visualizations using the GIBS tile service"
                    />
                  )
                }
                {
                  !hasMapImagery && (
                    <MetaIcon
                      id="feature-icon-list-view__map-imagery"
                      icon={FaMap}
                      iconProps={{ size: '15' }}
                      label="No map imagery"
                      notAvailable
                      tooltipClassName="collection-results-item__tooltip"
                      tooltipContent="No map visualization support"
                    />
                  )
                }
                {
                  isNrt && (
                    <MetaIcon
                      id="feature-icon-list-view__near-real-time"
                      icon={FaClock}
                      iconProps={{ size: '14' }}
                      label="Near Real Time"
                      metadata={nrtLabel}
                      tooltipClassName="collection-results-item__tooltip"
                      tooltipContent={nrtDescription}
                    />
                  )
                }
              </div>
              <p className="collection-results-item__desc">
                {summary}
              </p>
            </div>
            {
              thumbnail && (
                <div className={`collection-results-item__thumb ${loadingThumbnail ? 'collection-results-item__thumb--is-loading' : 'collection-results-item__thumb--is-loaded'}`}>
                  {
                    loadingThumbnail && (
                      <Spinner
                        type="dots"
                        dataTestId="collection-results-item-spinner"
                        className="collection-results-item__thumb-spinner"
                        color="white"
                        size="tiny"
                      />
                    )
                  }
                  <img
                    className={`collection-results-item__thumb-image ${loadingThumbnail ? 'collection-results-item__thumb-image--is-loading' : 'collection-results-item__thumb-image--is-loaded'}`}
                    src={base64Image}
                    alt={`Thumbnail for ${datasetId}`}
                    height={thumbnailHeight}
                    width={thumbnailWidth}
                  />
                </div>
              )
            }
          </div>
          <div className="collection-results-item__attribution">
            {
              ((filteredConsortiums && filteredConsortiums.length > 0) || isCSDA) && (
                <ul className="collection-results-item__attribution-list">
                  {
                    isCSDA && (
                      <OverlayTrigger
                        className="collection-results-item__tooltip-container"
                        placement="top"
                        overlay={
                          (
                            <Tooltip
                              id="tooltip__csda-badge"
                              className="collection-results-item__tooltip collection-results-item__tooltip--csda"
                            >
                              Commercial Smallsat Data Acquisition Program
                              <span className="tooltip__secondary-text">
                                (Additional authentication required)
                              </span>
                            </Tooltip>
                          )
                        }
                      >
                        <li className="collection-results-item__attribution-list-item">
                          <span className="collection-results-item__list-text collection-results-item__list-text--tooltip link">
                            <EDSCIcon
                              className="collection-results-item__icon collection-results-item__icon--csda d-inline-block me-1"
                              icon={FaLock}
                              size="8"
                            />
                            CSDA
                          </span>
                        </li>
                      </OverlayTrigger>
                    )
                  }
                  {
                    filteredConsortiums.map((consortium) => {
                      let consortiumDisplay = consortium
                      const consortiumTooltip = getConsortiumTooltipText(consortium)

                      if (consortiumTooltip) {
                        consortiumDisplay = (
                          <OverlayTrigger
                            className="collection-results-item__tooltip-container"
                            placement="top"
                            overlay={
                              (
                                <Tooltip
                                  className={`collection-results-item__tooltip collection-results-item__tooltip--${consortium}`}
                                >
                                  {consortiumTooltip}
                                </Tooltip>
                              )
                            }
                          >
                            <span className="collection-results-item__list-text collection-results-item__list-text--tooltip link">{consortiumDisplay}</span>
                          </OverlayTrigger>
                        )
                      }

                      return (
                        <li
                          key={`${collectionId}__consortium--${consortium}`}
                          className="collection-results-item__attribution-list-item"
                        >
                          {consortiumDisplay}
                        </li>
                      )
                    })
                  }
                </ul>
              )
            }
            <div className="collection-results-item__attribution-secondary">
              {
                (
                  shortName
                  && versionId
                  && displayOrganization
                ) && (
                  <div className="collection-results-item__attribution-wrap">
                    <div className="collection-results-item__attribution-string">
                      {`${shortName} v${versionId} - ${displayOrganization}`}
                    </div>
                  </div>
                )
              }
              <div className="collection-results-item__actions">
                <Button
                  className="collection-results-item__action collection-results-item__action--collection-details"
                  onClick={
                    (event) => {
                      onViewCollectionDetails(collectionId)
                      event.stopPropagation()
                    }
                  }
                  label="View collection details"
                  title="View collection details"
                  bootstrapSize="sm"
                  bootstrapVariant="light"
                  icon={AlertInformation}
                />
                <PortalFeatureContainer authentication>
                  <>
                    {isCollectionInProject && removeFromProjectButton}
                    {!isCollectionInProject && addToProjectButton}
                  </>
                </PortalFeatureContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return component
})

CollectionResultsItem.displayName = 'CollectionResultsItem'

CollectionResultsItem.propTypes = {
  collectionMetadata: collectionMetadataPropType.isRequired,
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired
}

export default CollectionResultsItem
