/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaExpand,
  FaList
} from 'react-icons/fa'
import {
  ListGroup,
  OverlayTrigger,
  Popover,
  Tooltip
} from 'react-bootstrap'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import EDSCImage from '../EDSCImage/EDSCImage'

import './GranuleResultsFocusedMeta.scss'

/**
 * Renders GranuleResultsFocusedMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.earthdataEnvironment - The current Earthdata environment.
 * @param {String} props.focusedGranuleMetadata - The metadata for any currently focused granule.
 * @param {String} props.focusedGranuleId - The id for the focused granule.
 */
const GranuleResultsFocusedMeta = ({
  earthdataEnvironment,
  focusedGranuleMetadata,
  focusedGranuleId
}) => {
  const { title, links = [], browseFlag } = focusedGranuleMetadata
  const testProtocol = /^(http|https):\/\//
  const [activeBrowseImageIndex, setActiveBrowseImageIndex] = useState(0)
  const [activeModalBrowseImageIndex, setActiveModalBrowseImageIndex] = useState(0)
  const [browseImageModalIsActive, setBrowseImageModalIsActive] = useState(false)
  const [showTitleTooltip, setShowTitleTooltip] = useState(false)
  const [showBrowseImageSelectionPopover, setShowBrowseImageSelectionPopover] = useState(false)
  const [showModalImageSelectionPopover, setShowModalImageSelectionPopover] = useState(false)
  const [hideTitleTooltip, setHideTitleTooltip] = useState(false)

  // Filter the links on the granule to find all browse links with an http/https protocol. This filters
  // any S3 browse links which cause protocol issues.
  const browseThumbnails = links.filter(({ rel, href }) => rel.indexOf('/browse#') > -1 && testProtocol.test(href))

  const onClickPreviousButton = () => {
    if (activeBrowseImageIndex > 0) {
      setActiveBrowseImageIndex(activeBrowseImageIndex - 1)
      return
    }
    setActiveBrowseImageIndex(browseThumbnails.length - 1)
  }

  const onClickNextButton = () => {
    if (activeBrowseImageIndex < browseThumbnails.length - 1) {
      setActiveBrowseImageIndex(activeBrowseImageIndex + 1)
      return
    }
    setActiveBrowseImageIndex(0)
  }

  const onClickModalPreviousButton = () => {
    if (activeModalBrowseImageIndex > 0) {
      setActiveModalBrowseImageIndex(activeModalBrowseImageIndex - 1)
      return
    }
    setActiveModalBrowseImageIndex(browseThumbnails.length - 1)
  }

  const onClickModalNextButton = () => {
    if (activeModalBrowseImageIndex < browseThumbnails.length - 1) {
      setActiveModalBrowseImageIndex(activeModalBrowseImageIndex + 1)
      return
    }
    setActiveModalBrowseImageIndex(0)
  }

  const onModalOpen = () => {
    setActiveModalBrowseImageIndex(activeBrowseImageIndex)
    setBrowseImageModalIsActive(true)
  }

  const onBrowseImageSelectionPopoverToggle = (show) => {
    setShowBrowseImageSelectionPopover(show)
    setHideTitleTooltip(show)
  }

  const onTitleTooltipToggle = (show) => {
    setShowTitleTooltip(show)
  }

  const browseImageSelectionButton = (
    <Button
      className="granule-results-focused-meta__image-nav-button"
      type="button"
      label="View available browse imagery"
      icon={FaList}
    />
  )

  const browseImageSelectionPopover = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      onToggle={onBrowseImageSelectionPopoverToggle}
      show={showBrowseImageSelectionPopover}
      overlay={(
        <Popover className="granule-results-focused-meta__list-popover">
          <ListGroup className="granule-results-focused-meta__list">
            {
              browseThumbnails.map(({ href, description }, i) => {
                const filename = href.split('/').pop()
                return (
                  <ListGroup.Item
                    className="granule-results-focused-meta__list-item"
                    as="button"
                    key={href}
                    active={activeBrowseImageIndex === i}
                    onClick={() => {
                      setActiveBrowseImageIndex(i)
                      setShowBrowseImageSelectionPopover(false)
                    }}
                  >
                    {description || filename}
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Popover>
      )}
    >
      {browseImageSelectionButton}
    </OverlayTrigger>
  )

  const modalBrowseImageSelectionPopover = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      onToggle={setShowModalImageSelectionPopover}
      show={showModalImageSelectionPopover}
      overlay={(
        <Popover className="granule-results-focused-meta__list-popover">
          <ListGroup className="granule-results-focused-meta__list">
            {
              browseThumbnails.map(({ href, description }, i) => {
                const filename = href.split('/').pop()
                return (
                  <ListGroup.Item
                    className="granule-results-focused-meta__list-item"
                    as="button"
                    key={href}
                    active={activeModalBrowseImageIndex === i}
                    onClick={() => {
                      setActiveModalBrowseImageIndex(i)
                    }}
                  >
                    {description || filename}
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Popover>
      )}
    >
      {browseImageSelectionButton}
    </OverlayTrigger>
  )

  // The href and title, containing only the filename, are used in multiple locations
  // so they are computed prior to rendering
  let activeModalHref
  let activeModalTitle
  let activeTitle

  if (browseThumbnails[activeModalBrowseImageIndex]) {
    const { description, href } = browseThumbnails[activeModalBrowseImageIndex]
    activeModalHref = href
    activeModalTitle = description || href.split('/').pop()
  }

  if (browseThumbnails[activeBrowseImageIndex]) {
    const { description, href } = browseThumbnails[activeBrowseImageIndex]
    activeTitle = description || href.split('/').pop()
  }

  return (
    <>
      <OverlayTrigger
        placement="top-start"
        delay={300}
        show={!hideTitleTooltip && showTitleTooltip}
        onToggle={onTitleTooltipToggle}
        overlay={(
          <Tooltip
            id="tooltip__granule-results-actions__download-all-button"
            className="tooltip--nowrap"
          >
            {activeTitle}
          </Tooltip>
        )}
      >
        <div>
          {
            // Focused granule id is used here to prevent a bug that surfaced with loading new focused granules.
            // The value in the store is becoming unset momentarily when focusing new granules.
            (focusedGranuleId && !!browseThumbnails.length && browseFlag) && (
              <div className="granule-results-focused-meta" data-testid="granule-results-focused-meta">
                <div className="granule-results-focused-meta__secondary-actions">
                  <Button
                    className="granule-results-focused-meta__image-nav-button"
                    type="button"
                    icon={FaExpand}
                    label="Expand browse image"
                    onClick={() => onModalOpen(true)}
                  />
                </div>
                {
                  (browseThumbnails.length && browseThumbnails.length > 1) && (
                    <nav className="granule-results-focused-meta__primary-actions">
                      <div className="granule-results-focused-meta__image-nav-primary">
                        <Button
                          className="granule-results-focused-meta__image-nav-button"
                          type="button"
                          icon={FaChevronLeft}
                          label="Previous thumbnail"
                          onClick={() => onClickPreviousButton()}
                        />
                        <Button
                          className="granule-results-focused-meta__image-nav-button"
                          type="button"
                          icon={FaChevronRight}
                          label="Next thumbnail"
                          onClick={() => onClickNextButton()}
                        />
                      </div>
                      <div className="granule-results-focused-meta__image-nav-secondary">
                        <span className="granule-results-focused-meta__pagination">
                          {`${activeBrowseImageIndex + 1}/${browseThumbnails.length}`}
                        </span>
                        {browseImageSelectionPopover}
                      </div>
                    </nav>
                  )
                }
                <div className="granule-results-focused-meta__thumb-container">
                  {
                    focusedGranuleId && browseThumbnails.map(({
                      href,
                      description = ''
                    }, i) => {
                      const thumbnailClassName = classNames([
                        'granule-results-focused-meta__thumb',
                        {
                          'granule-results-focused-meta__thumb--is-active': activeBrowseImageIndex === i
                        }
                      ])

                      // Preload each image as they are first rendered so they are more likely to be
                      // done loading prior to the user navigating to the next image
                      let preloadImg = new Image()
                      preloadImg.src = href
                      preloadImg.addEventListener('load', () => { preloadImg = undefined })

                      const imgSrc1x = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/browse-scaler/browse_images/granules/${focusedGranuleId}?h=150&w=150&imageSrc=${href}`
                      const imgSrc2x = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/browse-scaler/browse_images/granules/${focusedGranuleId}?h=300&w=300&imageSrc=${href}`

                      return (
                        href && (
                          <EDSCImage
                            key={href}
                            className={thumbnailClassName}
                            srcSet={`${imgSrc1x} 1x, ${imgSrc2x} 2x`}
                            src={imgSrc1x}
                            alt={description || `Browse image for ${title}`}
                            width="150px"
                            height="150px"
                          />
                        )
                      )
                    })
                  }
                </div>
              </div>
            )
          }
        </div>
      </OverlayTrigger>
      <EDSCModalContainer
        className="granule-results-focused-meta__browse-image-modal"
        id="granule-browse-image"
        isOpen={browseImageModalIsActive}
        onClose={() => setBrowseImageModalIsActive(false)}
        size="md"
        subtitle={activeModalTitle}
        body={(
          <>
            <div className="granule-results-focused-meta__full-container">
              {
                  focusedGranuleId && browseThumbnails.map(({
                    href,
                    description = ''
                  }, i) => {
                    const thumbnailClassName = classNames([
                      'granule-results-focused-meta__full',
                      {
                        'granule-results-focused-meta__full--is-active': activeModalBrowseImageIndex === i
                      }
                    ])

                    // Preload each image as they are first rendered so they are more likely to be
                    // done loading prior to the user navigating to the next image
                    let preloadImg = new Image()
                    preloadImg.src = href
                    preloadImg.addEventListener('load', () => { preloadImg = undefined })

                    return (
                      href && (
                        <EDSCImage
                          key={href}
                          className={thumbnailClassName}
                          src={href}
                          alt={description}
                          width="528px"
                          height="528px"
                        />
                      )
                    )
                  })
                }
            </div>
            {
              (browseThumbnails.length && browseThumbnails.length > 1) && (
                <nav className="granule-results-focused-meta__modal-primary-actions">
                  <div className="granule-results-focused-meta__modal-nav-primary">
                    <Button
                      className="granule-results-focused-meta__image-nav-button"
                      type="button"
                      icon={FaChevronLeft}
                      label="Previous thumbnail"
                      onClick={() => onClickModalPreviousButton()}
                    />
                    <Button
                      className="granule-results-focused-meta__image-nav-button"
                      type="button"
                      icon={FaChevronRight}
                      label="Next thumbnail"
                      onClick={() => onClickModalNextButton()}
                    />
                    <span className="granule-results-focused-meta__pagination">
                      {`${activeModalBrowseImageIndex + 1}/${browseThumbnails.length}`}
                    </span>
                    {modalBrowseImageSelectionPopover}
                  </div>
                  {
                    activeModalHref && (
                      <div className="granule-results-focused-meta__modal-nav-secondary">
                        <Button
                          className="granule-results-focused-meta__image-nav-button"
                          type="button"
                          target="__blank"
                          rel="noopener noreferrer"
                          icon={FaDownload}
                          label="Download browse image"
                          href={activeModalHref}
                        />
                      </div>
                    )
                  }
                </nav>
              )
            }
          </>
        )}
      />
    </>
  )
}

GranuleResultsFocusedMeta.propTypes = {
  earthdataEnvironment: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  focusedGranuleMetadata: PropTypes.shape({
    browseFlag: PropTypes.bool,
    conceptId: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string.isRequired,
        inherited: PropTypes.bool,
        rel: PropTypes.string.isRequired
      })
    ),
    title: PropTypes.string
  }).isRequired
}

export default GranuleResultsFocusedMeta
