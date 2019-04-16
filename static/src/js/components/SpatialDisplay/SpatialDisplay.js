import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'
import SpatialDisplayEntry from './SpatialDisplayEntry'

import './SpatialDisplay.scss'

const trimSpatial = (values, decimalPlaces = 4) => {
  if (!values || values[0] === '') {
    return values
  }
  return values.map(value => parseFloat(value).toFixed(decimalPlaces))
}

class SpatialDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boundingBoxSearch: '',
      pointSearch: '',
      polygonSearch: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      boundingBoxSearch,
      pointSearch,
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
      boundingBoxSearch,
      pointSearch,
      polygonSearch
    } = this.state

    let contents
    let entry

    if (pointSearch || drawingNewLayer === 'marker') {
      entry = (
        <SpatialDisplayEntry
          value={trimSpatial(pointSearch.split(','), 8).reverse().join(', ')}
        />
      )

      contents = (
        <FilterStackContents
          body={entry}
          title="Point"
        />
      )
    } else if (boundingBoxSearch || drawingNewLayer === 'rectangle') {
      if (boundingBoxSearch) {
        // Arrange the points in the right order
        const points = boundingBoxSearch
          .match(/[^,]+,[^,]+/g)
          .map(pointStr => trimSpatial(pointStr.split(','), 5).reverse().join(', '))

        entry = <SpatialDisplayEntry value={`SW: ${points[0]} NE: ${points[1]}`} />

        contents = (
          <FilterStackContents
            body={entry}
            title="Rectangle"
          />
        )
      }
    } else if (polygonSearch || drawingNewLayer === 'polygon') {
      entry = <SpatialDisplayEntry value={polygonSearch} />

      contents = (
        <FilterStackContents
          body={entry}
          title="Polygon"
        />
      )
    }

    if (!contents) {
      return null
    }

    return (
      <FilterStackItem
        icon="crop"
        title="Spatial"
      >
        {contents}
      </FilterStackItem>
    )
  }
}

SpatialDisplay.propTypes = {
  boundingBoxSearch: PropTypes.string.isRequired,
  drawingNewLayer: PropTypes.string.isRequired,
  pointSearch: PropTypes.string.isRequired,
  polygonSearch: PropTypes.string.isRequired
}

export default SpatialDisplay
