import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

import classNames from 'classnames'

import withDropzone from './withDropzone'
import './ShapefileDropzone.scss'

export class ShapefileDropzone extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  render() {
    const { className } = this.props
    const classes = classNames([
      'shapefile-dropzone',
      className
    ])

    return (
      <div
        ref={this.ref}
        className={classes}
        data-testid="shapefile-dropzone"
      />
    )
  }
}

ShapefileDropzone.propTypes = {
  className: PropTypes.string.isRequired
}

export default withDropzone(ShapefileDropzone)
