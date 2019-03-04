import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter
} from 'react-router-dom'
import { addUrlProps, UrlQueryParamTypes, subqueryOmit } from 'react-url-query'
import queryString from 'query-string'

import './GranuleResults.scss'

const urlPropsQueryConfig = {
  p: { type: UrlQueryParamTypes.string, queryParam: 'p' }
}

const mapStateToProps = state => ({
  granules: state.entities.granules
})

class GranuleResults extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      granules,
      location,
      p
    } = this.props

    const granuleResults = granules.allIds.map((id) => {
      const granule = granules.byId[id]

      return (
        <li key={granule.id}>{granule.id}</li>
      )
    })

    return (
      <div className="inner-panel">
        <Link to={{
          pathname: '/search',
          search: queryString
            .stringify(Object
              .assign({}, subqueryOmit(queryString.parse(location.search), 'p')))
        }}
        >
          Back to collections
        </Link>
        <p>Granules for collection</p>
        <ul>
          {p}
        </ul>
        {granuleResults}
      </div>
    )
  }
}

GranuleResults.defaultProps = {
  p: ''
}

GranuleResults.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  p: PropTypes.string
}

export default addUrlProps({ urlPropsQueryConfig })(
  withRouter(
    connect(mapStateToProps, null)(GranuleResults)
  )
)
