import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
  ArrowChevronRight,
  ArrowChevronLeft,
  Download,
  Expand,
  List
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import {
  ListGroup,
  OverlayTrigger,
  Popover,
  Tooltip
} from 'react-bootstrap'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import EDSCImage from '../EDSCImage/EDSCImage'

import './GranuleResultsFocusedMeta.scss'

/**
 * Renders GranuleResultsFocusedMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.focusedGranuleMetadata - The metadata for any currently focused granule.
 * @param {String} props.focusedGranuleId - The id for the focused granule.
 * @param {String} props.onMetricsBrowseGranuleImage - Callback function passed from actions to track metrics.
 */
const GranuleResultsFocusedMeta = ({
  focusedGranuleMetadata,
  focusedGranuleId,
  onMetricsBrowseGranuleImage
}) => {
  const { title, links = [], browseFlag } = focusedGranuleMetadata
  const [activeBrowseImageIndex, setActiveBrowseImageIndex] = useState(0)
  const [activeModalBrowseImageIndex, setActiveModalBrowseImageIndex] = useState(0)
  const [browseImageModalIsActive, setBrowseImageModalIsActive] = useState(false)
  const [showTitleTooltip, setShowTitleTooltip] = useState(false)
  const [showBrowseImageSelectionPopover, setShowBrowseImageSelectionPopover] = useState(false)
  const [showModalImageSelectionPopover, setShowModalImageSelectionPopover] = useState(false)
  const [hideTitleTooltip, setHideTitleTooltip] = useState(false)

  // Filter the links on the granule to find all browse links with an http/https protocol. This filters
  // any S3 browse links which cause protocol issues.
  const testProtocol = /^(http|https):\/\//
  const browseThumbnails = links.filter(({ rel, href }) => rel.includes('/browse#') && testProtocol.test(href))

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

  const browseImageSelectionButton = (listProps) => {
    const { modalIsOpen } = listProps

    return (
      <Button
        className="granule-results-focused-meta__image-nav-button"
        type="button"
        label="View available browse imagery"
        onClick={
          () => {
            onMetricsBrowseGranuleImage({
              modalOpen: modalIsOpen,
              granuleId: focusedGranuleId,
              value: 'View List'
            })
          }
        }
        icon={List}
      />
    )
  }

  const browseImageSelectionPopover = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      onToggle={onBrowseImageSelectionPopoverToggle}
      show={showBrowseImageSelectionPopover}
      overlay={
        (
          <Popover className="granule-results-focused-meta__list-popover">
            <ListGroup
              className="granule-results-focused-meta__list"
              data-testid="granule-results-focused-meta-list"
            >
              {
                browseThumbnails.map(({ href, description }, i) => {
                  const filename = href.split('/').pop()

                  return (
                    <ListGroup.Item
                      className="granule-results-focused-meta__list-item"
                      as="button"
                      key={href}
                      active={activeBrowseImageIndex === i}
                      onClick={
                        () => {
                          setActiveBrowseImageIndex(i)
                          setShowBrowseImageSelectionPopover(false)
                        }
                      }
                    >
                      {description || filename}
                    </ListGroup.Item>
                  )
                })
              }
            </ListGroup>
          </Popover>
        )
      }
    >
      {browseImageSelectionButton({ modalIsOpen: false })}
    </OverlayTrigger>
  )

  const modalBrowseImageSelectionPopover = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      onToggle={setShowModalImageSelectionPopover}
      show={showModalImageSelectionPopover}
      overlay={
        (
          <Popover className="granule-results-focused-meta__list-popover">
            <ListGroup
              className="granule-results-focused-meta__list"
              data-testid="granule-results-focused-meta-modal-popover-list"
            >
              {
                browseThumbnails.map(({ href, description }, i) => {
                  const filename = href.split('/').pop()

                  return (
                    <ListGroup.Item
                      className="granule-results-focused-meta__list-item"
                      as="button"
                      key={href}
                      active={activeModalBrowseImageIndex === i}
                      onClick={
                        () => {
                          setActiveModalBrowseImageIndex(i)
                          setShowModalImageSelectionPopover(false)
                        }
                      }
                    >
                      {description || filename}
                    </ListGroup.Item>
                  )
                })
              }
            </ListGroup>
          </Popover>
        )
      }
    >
      {browseImageSelectionButton({ modalIsOpen: true })}
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
        overlay={
          (
            <Tooltip
              id="tooltip__granule-results-actions__download-all-button"
              className="tooltip--nowrap"
              data-testid="granule-results-focused-meta-tooltip"
            >
              {activeTitle}
            </Tooltip>
          )
        }
      >
        <div data-testid="granule-results-focused-meta-overlay-wrapper">
          {
            // Focused granule id is used here to prevent a bug that surfaced with loading new focused granules.
            // The value in the store is becoming unset momentarily when focusing new granules.
            (focusedGranuleId && !!browseThumbnails.length && browseFlag) && (
              <div className="granule-results-focused-meta" data-testid="granule-results-focused-meta">
                <div className="granule-results-focused-meta__secondary-actions">
                  <Button
                    className="granule-results-focused-meta__image-nav-button"
                    type="button"
                    icon={Expand}
                    label="Expand browse image"
                    onClick={
                      () => {
                        onModalOpen(true)
                        onMetricsBrowseGranuleImage({
                          modalOpen: false,
                          granuleId: focusedGranuleId,
                          value: 'Expand'
                        })
                      }
                    }
                  />
                </div>
                {
                  // TODO can we consolidate and reuse the logic between the expanded modal and the panel?
                  (browseThumbnails.length && browseThumbnails.length > 1) && (
                    <nav className="granule-results-focused-meta__primary-actions">
                      <div className="granule-results-focused-meta__image-nav-primary">
                        <Button
                          className="granule-results-focused-meta__image-nav-button"
                          type="button"
                          icon={ArrowChevronLeft}
                          label="Previous browse image thumbnail"
                          onClick={
                            () => {
                              onClickPreviousButton()
                              onMetricsBrowseGranuleImage({
                                modalOpen: false,
                                granuleId: focusedGranuleId,
                                value: 'Previous'
                              })
                            }
                          }
                          data-testid="granule-results-focused-meta-nav-previous"
                        />
                        <Button
                          className="granule-results-focused-meta__image-nav-button"
                          type="button"
                          icon={ArrowChevronRight}
                          label="Next browse image thumbnail"
                          onClick={
                            () => {
                              onClickNextButton()
                              onMetricsBrowseGranuleImage({
                                modalOpen: false,
                                granuleId: focusedGranuleId,
                                value: 'Next'
                              })
                            }
                          }
                        />
                      </div>
                      <div className="granule-results-focused-meta__image-nav-secondary">
                        <span className="granule-results-focused-meta__image-nav-item  granule-results-focused-meta__pagination">
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
                      const imgSrc = `${getEnvironmentConfig().apiHost}/scale/granules/${focusedGranuleId}?h=175&w=175&imageSrc=${href}`
                      const key = `thumb-${href}-${i}`

                      return (
                        href && (
                          <EDSCImage
                            key={key}
                            className={thumbnailClassName}
                            src={imgSrc}
                            alt={description || `Browse image for ${title}`}
                            width={175}
                            height={175}
                            isBase64Image
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
        dataTestId="granule-results-focused-meta-modal"
        body={
          (
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

                    const modalImage = `${getEnvironmentConfig().apiHost}/scale/granules/${focusedGranuleId}?h=538&w=538&imageSrc=${href}`
                    const key = `modal-${href}-${i}`

                    return (
                      href && (
                        <EDSCImage
                          key={key}
                          className={thumbnailClassName}
                          src={modalImage}
                          alt={description || `Browse image for ${title}`}
                          width={538}
                          height={538}
                          isBase64Image
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
                        icon={ArrowChevronLeft}
                        label="Previous browse image"
                        onClick={
                          () => {
                            onClickModalPreviousButton()
                            onMetricsBrowseGranuleImage({
                              modalOpen: true,
                              granuleId: focusedGranuleId,
                              value: 'Previous'
                            })
                          }
                        }
                      />
                      <Button
                        className="granule-results-focused-meta__image-nav-button"
                        type="button"
                        icon={ArrowChevronRight}
                        label="Next browse image"
                        onClick={
                          () => {
                            onClickModalNextButton()
                            onMetricsBrowseGranuleImage({
                              modalOpen: true,
                              granuleId: focusedGranuleId,
                              value: 'Next'
                            })
                          }
                        }
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
                            onClick={
                              () => {
                                onMetricsBrowseGranuleImage({
                                  modalOpen: true,
                                  granuleId: focusedGranuleId,
                                  value: 'Download'
                                })
                              }
                            }
                            rel="noopener noreferrer"
                            icon={Download}
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
          )
        }
      />
    </>
  )
}

GranuleResultsFocusedMeta.propTypes = {
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
  }).isRequired,
  onMetricsBrowseGranuleImage: PropTypes.func.isRequired
}

export default GranuleResultsFocusedMeta
