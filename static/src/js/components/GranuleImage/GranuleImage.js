import React, { Component } from 'react'
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
class GranuleImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: true,
      isLoaded: false,
      isLoading: true,
      isErrored: false
    }

    this.handleToggleImage = this.handleToggleImage.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleImageErrored = this.handleImageErrored.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { imageSrc } = this.props
    const { imageSrc: nextImageSrc } = nextProps
    if (nextImageSrc && imageSrc !== nextImageSrc) {
      this.setState({
        isLoaded: false,
        isLoading: true,
        isErrored: false
      })
    }
  }

  handleToggleImage() {
    const {
      isOpen
    } = this.state

    this.setState({
      isOpen: !isOpen
    })
  }

  handleImageLoaded() {
    this.setState({
      isLoaded: true,
      isLoading: false,
      isErrored: false
    })
  }

  handleImageErrored() {
    this.setState({
      isLoaded: false,
      isLoading: false,
      isErrored: true
    })
  }

  render() {
    const {
      isErrored,
      isLoaded,
      isLoading,
      isOpen
    } = this.state

    const { imageSrc } = this.props

    const containerClassName = classNames({
      'granule-image': true,
      'granule-image--is-open': isOpen
    })

    const imageClassName = classNames({
      'granule-image__image': true,
      'granule-image__image--is-loaded': isLoaded
    })

    if (!imageSrc) return null

    return (
      <div className={containerClassName}>
        {
          isOpen ? (
            <Button
              className="granule-image__button granule-image__button--close"
              icon={FaTimes}
              onClick={this.handleToggleImage}
              label="Close browse image"
            />
          ) : (
            <Button
              className="granule-image__button granule-image__button--open"
              icon={FaPlus}
              onClick={this.handleToggleImage}
              label="Open browse image"
            />
          )
        }
        <div className="granule-image__container">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img
            className={imageClassName}
            src={imageSrc}
            alt="Browse Image"
            onLoad={this.handleImageLoaded}
            onError={this.handleImageErrored}
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
}

GranuleImage.propTypes = {
  imageSrc: PropTypes.string.isRequired
}

export default GranuleImage
