import React, { Component } from 'react'
import SimpleBar from 'simplebar-react'

import 'simplebar/dist/simplebar.min.css'

// eslint-disable-next-line react/prefer-stateless-function
export const withFancyScroll = WrappedComponent => class extends Component {
  static displayName = 'FancyScroll'

  render() {
    return (
      <SimpleBar>
        <WrappedComponent {...this.props} />
      </SimpleBar>
    )
  }
}
export default withFancyScroll
