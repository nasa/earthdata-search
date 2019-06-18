import React from 'react'

// import PropTypes from 'prop-types

import Well from '../Well/Well'

import './OrderStatus.scss'

export const OrderStatus = () => {
  const introduction = (
    <p>
      {'This page will automatically update as your orders are processed. The Order Status page can be accessed later by visiting '}
      <a href="https://search.earthdata.nasa.gov/data/retrieve/7536435386">https://search.earthdata.nasa.gov/data/retrieve/7536435386</a>
      {' or the '}
      <a href="/data/status/">Download Status and History</a>
      {' page.'}
    </p>
  )
  return (
    <Well>
      <Well.Main>
        <Well.Heading>Order Status</Well.Heading>
        <Well.Introduction>{introduction}</Well.Introduction>
        <Well.Section>
          Some content here
        </Well.Section>
        <Well.Heading>Additional Resources and Documentation</Well.Heading>
        <Well.Section>
          Some other content here
        </Well.Section>
      </Well.Main>
      <Well.Footer>
        <Well.Heading>Next Steps</Well.Heading>
        Some footer content
      </Well.Footer>
    </Well>
  )
}

// OrderStatus.defaultProps = {
//   children: null
// }

// OrderStatus.propTypes = {
//   children: PropTypes.node
// }

export default OrderStatus
