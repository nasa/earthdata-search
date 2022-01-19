import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FaCalendarAlt } from 'react-icons/fa'

import TemporalDisplayEntry from './TemporalDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import './TemporalDisplay.scss'

class TemporalDisplay extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      endDate: '',
      startDate: '',
      isRecurring: false
    }
    this.onTimelineRemove = this.onTimelineRemove.bind(this)
  }

  componentDidMount() {
    const {
      temporalSearch
    } = this.props

    const { endDate, startDate, isRecurring } = temporalSearch

    this.setState({
      endDate,
      startDate,
      isRecurring
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    if (temporalSearch !== nextProps.temporalSearch) {
      const { endDate, startDate, isRecurring } = nextProps.temporalSearch

      this.setState({
        endDate,
        startDate,
        isRecurring
      })
    }
  }

  onTimelineRemove() {
    const { onRemoveTimelineFilter } = this.props
    onRemoveTimelineFilter()
  }

  render() {
    const {
      endDate,
      startDate,
      isRecurring
    } = this.state

    if (!startDate && !endDate) {
      return null
    }

    const format = 'YYYY-MM-DDTHH:m:s.SSSZ'
    const startDateObject = moment.utc(startDate, format, true)
    const endDateObject = moment.utc(endDate, format, true)

    const temporalStartDisplay = startDate
      ? <TemporalDisplayEntry type="start" startDate={startDateObject} isRecurring={isRecurring} />
      : null
    const temporalEndDisplay = endDate
      ? <TemporalDisplayEntry type="end" endDate={endDateObject} isRecurring={isRecurring} />
      : null
    const temporalRangeDisplay = isRecurring
      ? <TemporalDisplayEntry type="range" startDate={startDateObject} endDate={endDateObject} isRecurring={isRecurring} shouldFormat={false} />
      : null

    return (
      <FilterStackItem
        icon={FaCalendarAlt}
        title="Temporal"
        onRemove={this.onTimelineRemove}
      >
        <FilterStackContents
          body={temporalStartDisplay}
          title="Start"
          showLabel
        />
        <FilterStackContents
          body={temporalEndDisplay}
          title="Stop"
          showLabel
        />
        <FilterStackContents
          body={temporalRangeDisplay}
          title="Range"
          showLabel
        />
      </FilterStackItem>
    )
  }
}

TemporalDisplay.defaultProps = {
  temporalSearch: {}
}

TemporalDisplay.propTypes = {
  onRemoveTimelineFilter: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    startDate: PropTypes.string
  })
}

export default TemporalDisplay
