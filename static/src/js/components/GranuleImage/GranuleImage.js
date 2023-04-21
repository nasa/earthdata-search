import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaPlus, FaTimes } from 'react-icons/fa'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './GranuleImage.scss'

/**
 * Renders GranuleImage.
 * @param {Object} props - The props passed into the component.
 * @param {String} imageSrc - The image source.
 */

// todo this should just inherit things from the parent container

export const GranuleImage = ({
  imageSrc
}) => {
  console.log('🚀 ~ file: GranuleImage.js:23 ~ imageSrc:', imageSrc)
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
    // todo Set state to the opposite state it is currently in
    // const [isOpen, setIsOpen] = useState(!isOpen)
    console.log('🚀 ~ file: GranuleImage.js:43 ~ handleToggleImage ~ isOpen:', isOpen)
    // const toggleIsOpen = (isOpen) => !isOpen
    setIsOpen(!isOpen)
    // todo why does this work but, not show up in console?
    console.log('🚀 ~ file: GranuleImage.js:45 ~ handleToggleImage ~ isOpen:', isOpen)
  })

  // todo set these values here

  // todo functions for managing state switches
  const handleImageLoaded = (() => {
  // this.setState({
    //   isLoaded: true,
    //   isLoading: false,
    //   isErrored: false
    // })
    // const [isLoaded, setIsLoaded] = useState(true)
    // const [isLoading, setIsLoading] = useState(false)
    // const [isErrored, setIsErrored] = useState(true)
    setIsLoaded(true)
    setIsLoading(false)
    setIsErrored(false)
  })

  const handleImageErrored = (() => {
    // this.setState({
    //   isLoaded: false,
    //   isLoading: false,
    //   isErrored: true
    // })
    // const [isLoaded, setIsLoaded] = useState(false)
    // const [isLoading, setIsLoading] = useState(false)
    // const [isErrored, setIsErrored] = useState(true)
    setIsLoaded(false)
    setIsLoading(false)
    setIsErrored(true)
  })
  // todo wait for the image to load
  const loadImage = () => {
    setIsErrored(false)
    setIsLoaded(false)
    setIsLoading(true)
  }

  // When the imageSrc changes value then load the new image
  useEffect(() => {
    loadImage()
  }, [imageSrc])

  if (!imageSrc) return null

  return (
    <div className={containerClassName}>
      { isOpen ? (
        <Button
          className="granule-image__button granule-image__button--close"
          icon={FaTimes}
          onClick={handleToggleImage}
          label="Close browse image"
          data-testid="granule-image__button granule-image__button--close"
        />
      ) : (
        <Button
          className="granule-image__button granule-image__button--open"
          icon={FaPlus}
          onClick={handleToggleImage}
          label="Open browse image"
          data-testid="granule-image__button granule-image__button--open"
        />
      )}
      <div className="granule-image__container">
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

// class GranuleImage extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       isOpen: true,
//       isLoaded: false,
//       isLoading: true,
//       isErrored: false
//     }

//     this.handleToggleImage = this.handleToggleImage.bind(this)
//     this.handleImageLoaded = this.handleImageLoaded.bind(this)
//     this.handleImageErrored = this.handleImageErrored.bind(this)
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     const { imageSrc } = this.props
//     const { imageSrc: nextImageSrc } = nextProps
//     if (nextImageSrc && imageSrc !== nextImageSrc) {
//       this.setState({
//         isLoaded: false,
//         isLoading: true,
//         isErrored: false
//       })
//     }
//   }

//   handleToggleImage() {
//     const {
//       isOpen
//     } = this.state

//     this.setState({
//       isOpen: !isOpen
//     })
//   }

//   handleImageLoaded() {
//     this.setState({
//       isLoaded: true,
//       isLoading: false,
//       isErrored: false
//     })
//   }

//   handleImageErrored() {
//     this.setState({
//       isLoaded: false,
//       isLoading: false,
//       isErrored: true
//     })
//   }

//   render() {
//     const {
//       isErrored,
//       isLoaded,
//       isLoading,
//       isOpen
//     } = this.state

//     const { imageSrc } = this.props

//     const containerClassName = classNames({
//       'granule-image': true,
//       'granule-image--is-open': isOpen
//     })

//     const imageClassName = classNames({
//       'granule-image__image': true,
//       'granule-image__image--is-loaded': isLoaded
//     })

//     if (!imageSrc) return null

//     return (
//       <div className={containerClassName}>
//         {
//           isOpen ? (
//             <Button
//               className="granule-image__button granule-image__button--close"
//               icon={FaTimes}
//               onClick={this.handleToggleImage}
//               label="Close browse image"
//             />
//           ) : (
//             <Button
//               className="granule-image__button granule-image__button--open"
//               icon={FaPlus}
//               onClick={this.handleToggleImage}
//               label="Open browse image"
//             />
//           )
//         }
//         <div className="granule-image__container">
//           {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
//           <img
//             className={imageClassName}
//             src={imageSrc}
//             alt="Browse Image"
//             onLoad={this.handleImageLoaded}
//             onError={this.handleImageErrored}
//           />
//           {
//             isLoading && (
//               <div className="granule-image__placeholder">
//                 <Spinner type="dots" color="green" size="small" />
//               </div>
//             )
//           }
//           {
//             isErrored && (
//               <div className="granule-image__placeholder">
//                 <span>Error loading granule image</span>
//               </div>
//             )
//           }
//         </div>
//       </div>
//     )
//   }
// }

GranuleImage.propTypes = {
  imageSrc: PropTypes.string.isRequired
}

export default GranuleImage
