import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import axios from 'axios'

import Spinner from '../Spinner/Spinner'

import './EDSCImage.scss'

/**
 * Renders EDSCImage.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.alt - The alt text to be used as the alt attribute on the image.
 * @param {String} props.dataTestId - An optional test id.
 * @param {String} props.className - An optional css class attribute.
 * @param {Integer} props.height - The height of the image.
 * @param {String} props.src - The src to be used as the src attribute on the image..
 * @param {String} props.srcSet - The srcSet to be used as the srcSet attribute on the image.
 * @param {Integer} props.width - The width of the image.
 */
export const EDSCImage = ({
  alt,
  className,
  dataTestId,
  height,
  src,
  srcSet,
  width,
  isBase64Image
}) => {
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

  const fetchImageData = async (imageSrc) => {
    console.log('🚀 ~ file: EDSCImage.js:54 ~ fetchImageData ~ imageSrc:', imageSrc)
    axios.get(imageSrc)
      .then((response) => {
        console.log('🚀 ~ file: EDSCImage.js:57 ~ .then ~ response:', response)
        // Set the base64 string received from Lambda
        setBase64Image(response.data.base64Image)
        onImageLoad()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  // Const fetchImageDataForAllGranuleSizes = async () => {
  //   const granuleImagesBase64 = []
  //   srcSet.forEach((imageSrc) => {
  //     axios.get(imageSrc)
  //       .then((response) => {
  //         console.log('🚀 ~ file: EDSCImage.js:71 ~ .then ~ response:', response)
  //         // Add the `base64` image returned from the lambda
  //         granuleImagesBase64.append(response.data.base64Image)
  //         console.log('Adding data into the arr ✅')
  //       })
  //       .catch((error) => {
  //         console.log('🚀 ~ file: EDSCImage.js:62 ~ useEffect ~ error:', error)
  //         console.error('Error:', error)
  //       })
  //   })
  // }

  useEffect(() => {
    if (isBase64Image) {
      fetchImageData(src)
      // If (srcSet) {
      //   console.log('Getting into image srcSet')
      //   fetchImageDataForAllGranuleSizes()
      // }
      //   // SrcSet.forEach((imageSrc) => {
      //   //   fetchImageDataForAllGranuleSizes(imageSrc)
      //   // })

    //   // onImageLoad()
    }
  }, [])

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
      { // TODO need srcSet
      // TODO why is the isError check causing issues
        isLoaded && isBase64Image && (
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
  srcSet: undefined,
  isBase64Image: false
}

EDSCImage.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  isBase64Image: PropTypes.bool,
  width: PropTypes.number.isRequired
}

export default EDSCImage
