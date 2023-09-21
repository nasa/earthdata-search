import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
    document.body.addEventListener('click', this.metricsClick)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.metricsClick)
  }

  metricsClick(e) {
    const { onMetricsClick } = this.props
    const { target } = e

    const clickableParent = target.closest('a, button')

    if (!clickableParent) return

    const title = target.title || target.text

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
