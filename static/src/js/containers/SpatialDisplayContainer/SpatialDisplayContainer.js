import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import './SpatialDisplayContainer.scss'

const mapStateToProps = state => ({
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon,
  drawingNewLayer: state.map.drawingNewLayer
})

export class SpatialDisplayContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pointSearch: '',
      boundingBoxSearch: '',
      polygonSearch: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch
    } = this.props

    if (pointSearch !== nextProps.pointSearch) {
      this.setState({ pointSearch: nextProps.pointSearch })
    }
    if (boundingBoxSearch !== nextProps.boundingBoxSearch) {
      this.setState({ boundingBoxSearch: nextProps.boundingBoxSearch })
    }
    if (polygonSearch !== nextProps.polygonSearch) {
      this.setState({ polygonSearch: nextProps.polygonSearch })
    }
  }

  render() {
    const { drawingNewLayer } = this.props
    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch
    } = this.state

    let text
    if (pointSearch || drawingNewLayer === 'marker') {
      text = `Point: ${pointSearch.split(',').reverse().join(',')}`
    } else if (boundingBoxSearch || drawingNewLayer === 'rectangle') {
      text = 'Rectangle'
      if (boundingBoxSearch) {
        // Arrange the points in the right order
        const points = boundingBoxSearch
          .match(/[^,]+,[^,]+/g)
          .map(pointStr => pointStr.split(',').reverse().join(','))

        text = `Rectangle: SW: ${points[0]} NE: ${points[1]}`
      }
    } else if (polygonSearch || drawingNewLayer === 'polygon') {
      text = 'Polygon'
    }

    if (!text) {
      return null
    }

    return (
      <div className="spatial-display">
        {text}
      </div>
    )
  }
}

SpatialDisplayContainer.defaultProps = {
  pointSearch: '',
  boundingBoxSearch: '',
  polygonSearch: '',
  drawingNewLayer: ''
}

SpatialDisplayContainer.propTypes = {
  pointSearch: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  drawingNewLayer: PropTypes.string
}

export default connect(mapStateToProps)(SpatialDisplayContainer)
