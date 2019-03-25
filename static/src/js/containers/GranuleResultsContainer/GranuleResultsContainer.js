import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter
} from 'react-router-dom'
import queryString from 'query-string'
import actions from '../../actions/index'

import './GranuleResultsContainer.scss'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange: (collectionId) => {
    dispatch(actions.changeFocusedCollection(collectionId))
  }
})

const mapStateToProps = state => ({
  granules: state.entities.granules,
  focusedCollection: state.focusedCollection
})

class GranuleResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleBackClick = this.handleBackClick.bind(this)
  }

  handleBackClick = () => {
    const { onFocusedCollectionChange } = this.props
    onFocusedCollectionChange('')
  }

  render() {
    const {
      granules,
      location,
      focusedCollection
    } = this.props

    const granuleResults = granules.allIds.map((id) => {
      const granule = granules.byId[id]

      return (
        <li key={granule.id}>{granule.id}</li>
      )
    })

    return (
      <div className="inner-panel">
        <Link
          onClick={this.handleBackClick}
          to={{
            pathname: '/search',
            search: queryString
              .stringify(Object
                .assign({}, queryString.parse(location.search)))
          }}
        >
          Back to collections
        </Link>
        <p>Granules for collection</p>
        <ul>
          {focusedCollection}
        </ul>
        {granuleResults}
      </div>
    )
  }
}

GranuleResultsContainer.defaultProps = {
  focusedCollection: ''
}

GranuleResultsContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsContainer)
)
