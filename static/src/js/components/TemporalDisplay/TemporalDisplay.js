import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import TemporalDisplayEntry from './TemporalDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import './TemporalDisplay.scss'

class TemporalDisplay extends PureComponent {
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
      const { endDate, startDate } = nextProps.temporalSearch

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

    const temporalStartDisplay = startDate
      ? <TemporalDisplayEntry type="start" value={startDate} />
      : null
    const temporalEndDisplay = endDate
      ? <TemporalDisplayEntry type="end" value={endDate} />
      : null

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
          title="Stop"
        />
      </FilterStackItem>
    )
  }
}

TemporalDisplay.defaultProps = {
  temporalSearch: {}
}

TemporalDisplay.propTypes = {
  temporalSearch: PropTypes.shape({})
}

export default TemporalDisplay
