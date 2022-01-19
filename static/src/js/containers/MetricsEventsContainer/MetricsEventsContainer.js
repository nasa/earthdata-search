import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import $ from 'jquery'

import { metricsClick } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsClick:
    (data) => dispatch(metricsClick(data))
})

export class MetricsEventsContainer extends Component {
  constructor() {
    super()
    this.metricsClick = this.metricsClick.bind(this)
  }

  componentDidMount() {
    $(document).on('click', 'a, button', this.metricsClick)
  }

  componentWillUnmount() {
    $(document).off('click', 'a, button', this.metricsClick)
  }

  metricsClick(e) {
    const { onMetricsClick } = this.props
    const { currentTarget = {} } = e
    const title = $(currentTarget)[0].title || $(currentTarget).text()

    onMetricsClick({
      elementLabel: title
    })
  }

  render() {
    return null
  }
}

MetricsEventsContainer.propTypes = {
  onMetricsClick: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(MetricsEventsContainer)
