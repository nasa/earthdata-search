import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import CollectionDetailsBody from '../../components/CollectionDetails/CollectionDetailsBody'

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state)
})

export const CollectionDetailsBodyContainer = ({
  collectionMetadata,
  isActive,
  onToggleRelatedUrlsModal
}) => (
  <CollectionDetailsBody
    collectionMetadata={collectionMetadata}
    isActive={isActive}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

CollectionDetailsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsBodyContainer)
)
