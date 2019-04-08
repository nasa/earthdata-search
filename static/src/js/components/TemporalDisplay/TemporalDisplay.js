import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TemporalDisplayEntry from './TemporalDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

class TemporalDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      endDate: '',
      startDate: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    if (temporalSearch !== nextProps.temporalSearch) {
      const [startDate, endDate] = nextProps.temporalSearch.split(',')

      this.setState({
        endDate,
        startDate
      })
    }
  }

  render() {
    const {
      endDate,
      startDate
    } = this.state

    if (!startDate && !endDate) {
      return null
    }

    const temporalStartDisplay = startDate ? <TemporalDisplayEntry type="start" value={startDate} /> : null
    const temporalEndDisplay = endDate ? <TemporalDisplayEntry type="end" value={endDate} /> : null

    return (
      <FilterStackItem
        icon="clock-o"
        title="Temporal"
      >
        <FilterStackContents
          body={temporalStartDisplay}
          title="Start"
        />
        <FilterStackContents
          body={temporalEndDisplay}
          title="End"
        />
      </FilterStackItem>
    )
  }
}

TemporalDisplay.defaultProps = {
  temporalSearch: ''
}

TemporalDisplay.propTypes = {
  temporalSearch: PropTypes.string
}

export default TemporalDisplay
