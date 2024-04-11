import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Spinner from '../Spinner/Spinner'

import './EDSCImage.scss'

/**
 * Renders EDSCImage.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.alt - The alt text to be used as the alt attribute on the image.
 * @param {String} props.dataTestId - An optional test id.
 * @param {String} props.className - An optional css class attribute.
 * @param {String} props.height - The height of the image.
 * @param {String} props.src - The src to be used as the src attribute on the image..
 * @param {String} props.srcSet - The srcSet to be used as the srcSet attribute on the image.
 * @param {String} props.width - The width of the image.
 */
export const EDSCImage = ({
  alt,
  className,
  dataTestId,
  height,
  src,
  srcSet,
  width
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isErrored, setIsErrored] = useState(false)

  const onImageLoad = () => {
    setIsLoaded(true)
  }

  const onImageError = () => {
    // TODO This can be improved by adding some sort of visual indication to the user
    setIsErrored(true)
  }

  const imageClasses = classNames([
    'edsc-image',
    {
      'edsc-image--is-loaded': isLoaded,
      'edsc-image--is-errored': isErrored
    }
  ])

  return (
    <div
      className={`${imageClasses} ${className}`}
      data-testid={dataTestId}
    >
      {
        (!isLoaded && !isErrored) && (
          <Spinner
            className="edsc-image__spinner"
            type="dots"
            size="small"
            dataTestId="edsc-image-spinner"
          />
        )
      }
      {
        !isErrored && (
          <img
            className="edsc-image__image"
            alt={alt}
            height={height}
            width={width}
            src={src}
            srcSet={srcSet}
            onLoad={onImageLoad}
            onError={onImageError}
          />
        )
      }
    </div>
  )
}

EDSCImage.defaultProps = {
  className: undefined,
  dataTestId: undefined,
  srcSet: undefined
}

EDSCImage.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  height: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  width: PropTypes.string.isRequired
}

export default EDSCImage
