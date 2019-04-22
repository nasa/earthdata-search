import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import { pure } from 'recompose'

import actions from '../../actions/index'

import MasterOverlayPanel from '../../components/MasterOverlayPanel/MasterOverlayPanel'

const mapStateToProps = state => ({
  masterOverlayPanel: state.ui.masterOverlayPanel,
  panelHeight: state.ui.masterOverlayPanel.height,
  collectionHits: state.entities.collections.hits
})

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onMasterOverlayHeightChange:
    newHeight => dispatch(actions.masterOverlayPanelResize(newHeight)),
  onMasterOverlayPanelDragStart:
    data => dispatch(actions.masterOverlayPanelDragStart(data)),
  onMasterOverlayPanelDragEnd:
    () => dispatch(actions.masterOverlayPanelDragEnd())
})

/**
 * Passes props to the MasterOverlayPanel component.
 * @param {object} props - The props to pass to the component.
 * @param {ReactElement} props.header - The element to pass that make up the header section.
 * @param {ReactElement} props.body - The element to pass that make up the body section.
 * @param {number} props.panelHeight - (Redux) The height of the component from the redux store.
 * @param {number} props.collectionHits - (Redux) The elements to pass that make up the body section.
 * @return {ReactElement} The connected component.
 */
const MasterOverlayPanelContainer = (props) => {
  const {
    header,
    body,
    panelHeight,
    collectionHits,
    masterOverlayPanel,
    onFocusedCollectionChange,
    onMasterOverlayHeightChange,
    onMasterOverlayPanelDragStart,
    onMasterOverlayPanelDragEnd
  } = props

  return (
    <MasterOverlayPanel
      header={header}
      body={body}
      panelHeight={panelHeight}
      collectionHits={collectionHits}
      masterOverlayPanel={masterOverlayPanel}
      onFocusedCollectionChange={onFocusedCollectionChange}
      onMasterOverlayHeightChange={onMasterOverlayHeightChange}
      onMasterOverlayPanelDragStart={onMasterOverlayPanelDragStart}
      onMasterOverlayPanelDragEnd={onMasterOverlayPanelDragEnd}
    />
  )
}

MasterOverlayPanelContainer.defaultProps = {
  collectionHits: null
}

MasterOverlayPanelContainer.propTypes = {
  body: PropTypes.node.isRequired,
  collectionHits: PropTypes.string,
  header: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired,
  masterOverlayPanel: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired,
  onMasterOverlayPanelDragStart: PropTypes.func.isRequired,
  onMasterOverlayPanelDragEnd: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterOverlayPanelContainer)
