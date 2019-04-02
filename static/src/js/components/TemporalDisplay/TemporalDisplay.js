import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TemporalSelection from './TemporalSelection'

class TemporalDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      startDate: '',
      endDate: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    if (temporalSearch !== nextProps.temporalSearch) {
      const [startDate, endDate] = nextProps.temporalSearch.split(',')

      this.setState({
        startDate,
        endDate
      })
    }
  }

  render() {
    const {
      startDate,
      endDate
    } = this.state

    if (!startDate && !endDate) {
      return null
    }

    return (
      <div className="temporal-display">
        { startDate && <TemporalSelection type="start" value={startDate} /> }
        { endDate && <TemporalSelection type="end" value={endDate} /> }
      </div>
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
