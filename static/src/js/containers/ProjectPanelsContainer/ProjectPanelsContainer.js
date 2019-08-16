import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'
import { togglePanels, setActivePanel } from '../../actions/projectPanels'


const mapStateToProps = state => ({
  collections: state.metadata.collections,
  collectionsSearch: state.searchResults.collections,
  project: state.project,
  projectPanels: state.projectPanels,
  shapefileId: state.shapefile.shapefileId,
  spatial: state.query.collection.spatial
})

const mapDispatchToProps = dispatch => ({
  onSelectAccessMethod:
    method => dispatch(actions.selectAccessMethod(method)),
  onTogglePanels:
    value => dispatch(togglePanels(value)),
  onSetActivePanel:
    panelId => dispatch(setActivePanel(panelId)),
  onUpdateAccessMethod:
    data => dispatch(actions.updateAccessMethod(data))
})

export const ProjectPanelsContainer = ({
  collections,
  collectionsSearch,
  project,
  projectPanels,
  shapefileId,
  spatial,
  onSelectAccessMethod,
  onTogglePanels,
  onSetActivePanel,
  onUpdateAccessMethod
}) => (
  <ProjectPanels
    collections={collections}
    collectionsSearch={collectionsSearch}
    project={project}
    projectPanels={projectPanels}
    shapefileId={shapefileId}
    spatial={spatial}
    onSelectAccessMethod={onSelectAccessMethod}
    onTogglePanels={onTogglePanels}
    onSetActivePanel={onSetActivePanel}
    onUpdateAccessMethod={onUpdateAccessMethod}
  />
)

ProjectPanelsContainer.defaultProps = {
  shapefileId: null
}

ProjectPanelsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectPanels: PropTypes.shape({}).isRequired,
  shapefileId: PropTypes.string,
  spatial: PropTypes.shape({}).isRequired,
  onSelectAccessMethod: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onUpdateAccessMethod: PropTypes.func.isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanelsContainer)
