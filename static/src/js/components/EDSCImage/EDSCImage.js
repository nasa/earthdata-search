import React, {
  useState,
  useEffect,
  memo
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import retrieveThumbnail from '../../util/retrieveThumbnail'

import Spinner from '../Spinner/Spinner'

import './EDSCImage.scss'

/**
 * Renders EDSCImage.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.alt - The alt text to be used as the alt attribute on the image.
 * @param {String} props.dataTestId - An optional test id.
 * @param {String} props.className - An optional css class attribute.
 * @param {Integer} props.height - The height of the image.
 * @param {Boolean} props.isBase64Image - If this image needs to be retrieved asynchronously because a header must be passed
 * @param {String} props.src - The src to be used as the src attribute on the image..
 * @param {Boolean} props.srcSet - The srcSet to be used as the srcSet attribute on the image.
 * @param {Boolean} props.useSpinner - If the spinner should be used for this Image while it is loading
 * @param {Integer} props.width - The width of the image.
 */
export const EDSCImage = (props) => {
  const {
    alt,
    className,
    dataTestId,
    height,
    isBase64Image,
    src,
    srcSet,
    useSpinner,
    width
  } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [base64Image, setBase64Image] = useState('')

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

  const parseScaleImageResponse = async () => {
    const thumbnail = await retrieveThumbnail(src)
    setBase64Image(thumbnail)
    onImageLoad()
  }

  useEffect(() => {
    let isMounted = true
    if (isBase64Image && isMounted) {
      parseScaleImageResponse()
    }

    // Cleanup function to cancel fetching when component unmounts
    return () => {
      isMounted = false // Set the flag to false when component unmounts
    }
  }, [])

  return (
    <div
      className={`${imageClasses} ${className}`}
      data-testid={dataTestId}
    >
      {
        (!isLoaded && !isErrored) && useSpinner && (
          <Spinner
            className="edsc-image__spinner"
            type="dots"
            size="small"
            dataTestId="edsc-image-spinner"
          />
        )
      }
      {
        // If src is a standard image endpoint
        !isErrored && !isBase64Image && (
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
      {
      // TODO why is the isError check causing issues
        !isErrored && isLoaded && isBase64Image && (
          <img
            className="edsc-image__image"
            alt={alt}
            height={height}
            width={width}
            src={base64Image}
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
  isBase64Image: false,
  srcSet: undefined,
  useSpinner: true
}

EDSCImage.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  height: PropTypes.number.isRequired,
  isBase64Image: PropTypes.bool,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  useSpinner: PropTypes.bool,
  width: PropTypes.number.isRequired
}

export default memo(EDSCImage)
