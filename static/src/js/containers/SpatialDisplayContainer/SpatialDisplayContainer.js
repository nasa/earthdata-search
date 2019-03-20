import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import './SpatialDisplayContainer.scss'

const mapStateToProps = state => ({
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon
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
    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch
    } = this.state

    let text
    if (pointSearch) {
      text = `Point: ${pointSearch.split(',').reverse().join(',')}`
    } else if (boundingBoxSearch) {
      // Arrange the points in the right order
      const points = boundingBoxSearch
        .match(/[^,]+,[^,]+/g)
        .map(pointStr => pointStr.split(',').reverse().join(','))

      text = `Rectangle: SW: ${points[0]} NE: ${points[1]}`
    } else if (polygonSearch) {
      text = 'Polygon'
    }

    if (!text) {
      return null
    }

    return (
      <div>
        <div className="spatial-display">
          {text}
        </div>
      </div>
    )
  }
}

SpatialDisplayContainer.defaultProps = {
  pointSearch: '',
  boundingBoxSearch: '',
  polygonSearch: ''
}

SpatialDisplayContainer.propTypes = {
  pointSearch: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  polygonSearch: PropTypes.string
}

export default connect(mapStateToProps)(SpatialDisplayContainer)
