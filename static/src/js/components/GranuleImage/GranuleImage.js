import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaPlus, FaTimes } from 'react-icons/fa'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './GranuleImage.scss'

/**
 * Renders GranuleImage component. This component displays the image of a granule if it has one
 * the image can be open or closed with buttons
 * @param {Object} props - The props passed into the component.
 * @param {String} props.imageSrc - The image source.
 */
export const GranuleImage = ({
  imageSrc
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  const containerClassName = classNames({
    'granule-image': true,
    'granule-image--is-open': isOpen
  })

  const imageClassName = classNames({
    'granule-image__image': true,
    'granule-image__image--is-loaded': isLoaded
  })

  const handleToggleImage = (() => {
    setIsOpen(!isOpen)
  })

  const handleImageLoaded = (() => {
    setIsLoaded(true)
    setIsLoading(false)
    setIsErrored(false)
  })

  const handleImageErrored = (() => {
    setIsLoaded(false)
    setIsLoading(false)
    setIsErrored(true)
  })

  // When the imageSrc changes value then load the new image
  useEffect(() => {
    setIsErrored(false)
    setIsLoaded(false)
    setIsLoading(true)
  }, [imageSrc])

  if (!imageSrc) return null

  return (
    <div
      className={containerClassName}
    >
      { isOpen ? (
        <Button
          className="granule-image__button granule-image__button--close"
          icon={FaTimes}
          onClick={handleToggleImage}
          label="Close browse image"
          dataTestId="granule-image__button--close"
        />
      ) : (
        <Button
          className="granule-image__button granule-image__button--open"
          icon={FaPlus}
          onClick={handleToggleImage}
          label="Open browse image"
          dataTestId="granule-image__button--open"
        />
      )}
      <div
        className="granule-image__container"
        data-testid="granule-image"
      >
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img
          className={imageClassName}
          src={imageSrc}
          alt="Browse Image"
          onLoad={handleImageLoaded}
          onError={handleImageErrored}
        />
        {
          isLoading && (
            <div className="granule-image__placeholder">
              <Spinner type="dots" color="white" size="small" />
            </div>
          )
        }
        {
          isErrored && (
            <div className="granule-image__placeholder">
              <span>Error loading granule image</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

GranuleImage.propTypes = {
  imageSrc: PropTypes.string.isRequired
}

export default GranuleImage
