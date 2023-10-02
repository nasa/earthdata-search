import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'
import ProjectPanelSection from './ProjectPanelSection'
import { Tree } from '../Tree/Tree'

import './VariableTreePanel.scss'

export const VariableTreePanel = (props) => {
  const [treeView, setTreeView] = useState('hierarchy')

  const {
    accessMethods,
    collectionId,
    index,
    selectedAccessMethod,
    onUpdateSelectedVariables,
    onViewDetails
  } = props

  if (!accessMethods || !selectedAccessMethod) return null

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    keywordMappings = [],
    hierarchyMappings = [],
    selectedVariables = [],
    variables
  } = selectedMethod
  if (!variables) return null

  const hierarchyButtonClasses = classNames([
    'variable-tree-panel__tree-switcher-button',
    {
      'variable-tree-panel__tree-switcher-button--is-active': treeView === 'hierarchy'
    }
  ])

  const scienceKeywordButtonClasses = classNames([
    'variable-tree-panel__tree-switcher-button',
    {
      'variable-tree-panel__tree-switcher-button--is-active': treeView === 'scienceKeyword'
    }
  ])

  const browseBy = (
    <div className="variable-tree-panel__tree-switcher">
      <span>Browse by:</span>
      <div className="variable-tree-panel__tree-switcher-buttons">
        <Button
          bootstrapSize="sm"
          className={hierarchyButtonClasses}
          label="Hierarchy"
          type="button"
          onClick={() => setTreeView('hierarchy')}
        >
          Hierarchy
        </Button>
        <Button
          bootstrapSize="sm"
          className={scienceKeywordButtonClasses}
          label="Science Keyword"
          type="button"
          onClick={() => setTreeView('scienceKeyword')}
        >
          Science Keyword
        </Button>
      </div>
    </div>
  )

  let items = treeView === 'hierarchy' ? hierarchyMappings : keywordMappings

  // If keywordMappings or hierarchyMappings don't exist, default items to the one that does exist
  if (keywordMappings.length && !hierarchyMappings.length) items = keywordMappings
  if (!keywordMappings.length && hierarchyMappings.length) items = hierarchyMappings

  return (
    <ProjectPanelSection heading="Variable Selection">
      {keywordMappings.length > 0 && hierarchyMappings.length > 0 && browseBy}
      <Tree
        key={treeView}
        collectionId={collectionId}
        index={index}
        items={items}
        selectedVariables={selectedVariables}
        variables={variables}
        onUpdateSelectedVariables={onUpdateSelectedVariables}
        onViewDetails={onViewDetails}
      />
    </ProjectPanelSection>
  )
}

VariableTreePanel.defaultProps = {
  accessMethods: undefined,
  selectedAccessMethod: undefined
}

VariableTreePanel.propTypes = {
  accessMethods: PropTypes.shape({}),
  collectionId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectedAccessMethod: PropTypes.string,
  onUpdateSelectedVariables: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
}

export default VariableTreePanel
