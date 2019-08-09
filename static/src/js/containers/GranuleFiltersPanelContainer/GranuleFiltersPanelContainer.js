import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import SecondaryOverlayPanelContainer
  from '../SecondaryOverlayPanelContainer/SecondaryOverlayPanelContainer'
import GranuleFiltersHeaderContainer
  from '../GranuleFiltersHeaderContainer/GranuleFiltersHeaderContainer'
import GranuleFiltersBodyContainer
  from '../GranuleFiltersBodyContainer/GranuleFiltersBodyContainer'
import GranuleFiltersActionsContainer
  from '../GranuleFiltersActionsContainer/GranuleFiltersActionsContainer'

import actions from '../../actions'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})

const mapDispatchToProps = dispatch => ({
  onGetGranules:
    () => dispatch(actions.getGranules()),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUpdateCollectionGranuleFilters:
    (id, granuleFilters) => dispatch(actions.updateCollectionGranuleFilters(id, granuleFilters)),
  onUpdateGranuleQuery:
    state => dispatch(actions.updateGranuleQuery(state))
})

export class GranuleFiltersPanelContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      granuleFilters: this.getGranuleFilters()
    }

    this.onUpdateGranuleFilters = this.onUpdateGranuleFilters.bind(this)
    this.onApplyGranuleFilters = this.onApplyGranuleFilters.bind(this)
    this.onClearGranuleFilters = this.onClearGranuleFilters.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { granuleFilters } = this.state
    const currentGranuleFilters = this.getGranuleFilters(nextProps)

    if (!isEqual(currentGranuleFilters, granuleFilters)) {
      this.setState({
        granuleFilters: currentGranuleFilters
      })
    }
  }


  onUpdateGranuleFilters(filters) {
    const { granuleFilters } = this.state

    this.setState({
      granuleFilters: {
        ...granuleFilters,
        ...filters
      }
    })
  }

  onApplyGranuleFilters() {
    const { granuleFilters } = this.state

    const {
      focusedCollection,
      onGetGranules,
      onToggleSecondaryOverlayPanel,
      onUpdateGranuleQuery,
      onUpdateCollectionGranuleFilters
    } = this.props

    onUpdateGranuleQuery({ pageNum: 1 })
    onUpdateCollectionGranuleFilters(focusedCollection, granuleFilters)
    onGetGranules()
    onToggleSecondaryOverlayPanel(false)
  }

  onClearGranuleFilters() {
    const {
      focusedCollection,
      onGetGranules,
      onUpdateGranuleQuery,
      onUpdateCollectionGranuleFilters
    } = this.props

    onUpdateGranuleQuery({ pageNum: 1 })
    onUpdateCollectionGranuleFilters(focusedCollection, {})
    onGetGranules()
  }

  getGranuleFilters(props = this.props) {
    const {
      collections,
      focusedCollection
    } = props
    const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

    if (Object.keys(focusedCollectionMetadata).length === 0) return {}

    const { granuleFilters } = focusedCollectionMetadata[focusedCollection]

    return granuleFilters
  }

  render() {
    const { granuleFilters } = this.state
    return (
      <SecondaryOverlayPanelContainer
        header={<GranuleFiltersHeaderContainer />}
        body={(
          <GranuleFiltersBodyContainer
            granuleFilters={granuleFilters}
            onUpdateGranuleFilters={this.onUpdateGranuleFilters}
          />
        )}
        footer={(
          <GranuleFiltersActionsContainer
            onApplyClick={this.onApplyGranuleFilters}
            onClearClick={this.onClearGranuleFilters}
          />
        )}
      />
    )
  }
}

// SecondaryOverlayPanelContainer.defaultProps = {
//   footer: null
// }

GranuleFiltersPanelContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  onGetGranules: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUpdateGranuleQuery: PropTypes.func.isRequired,
  onUpdateCollectionGranuleFilters: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleFiltersPanelContainer)
