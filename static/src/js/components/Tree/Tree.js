import React, {
  useState, useRef, useEffect, useCallback
} from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import { TreeItem } from './TreeItem'
import { TreeNode } from '../../util/tree/TreeNode'

import './Tree.scss'

export const Tree = ({
  collectionId,
  index,
  items,
  selectedVariables,
  variables,
  onUpdateSelectedVariables,
  onViewDetails
}) => {
  const treeModel = useRef(undefined)

  const lastSeralized = useRef([])

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  /**
   * Update the form model with new values from the tree
   */
  const updateSelectedVariables = () => {
    const seralized = treeModel.current.seralize()

    // Compare the last seralized value to the current value. If it hasn't changed, don't update the store
    if (lastSeralized.current === undefined || !isEqual(seralized, lastSeralized.current)) {
      lastSeralized.current = seralized
      onUpdateSelectedVariables(seralized, collectionId)
    }
  }

  // Initial render - setup TreeNode object to drive the tree data
  useEffect(() => {
    treeModel.current = new TreeNode({
      items: { children: items },
      selectedVariables,
      variables,
      onUpdateFinished: forceUpdate
    })
  }, []) // Only execute this useEffect once on initial render

  /**
   * Update the treeModel with new values
   */
  const updateTreeModel = () => {
    treeModel.current = treeModel.current.updateNode({ children: items }, selectedVariables)
  }

  /**
   * Update the tree model, then update the form model with changes from the update
   */
  const update = (async () => {
    await updateTreeModel()
    await updateSelectedVariables()
  })

  // Update the treeModel when the form model data changes
  useEffect(() => {
    update()
  }, [selectedVariables]) // When the tree is inside a group, it needs to update when anything in the form changes, so this useEffect runs on the full data model from the context

  if (!treeModel.current) {
    return (
      <div>Loading...</div>
    )
  }

  /**
   * onChange callback from TreeItem, update the form model
   */
  const onChange = () => {
    updateSelectedVariables()
  }

  /**
   * Build out the TreeItem list of children elements
   */
  const nodeList = () => treeModel.current.children.map((child, i) => (
    <TreeItem
      key={`${child.getKey()}`}
      index={index}
      item={child}
      onChange={onChange}
      isFirst={i === 0}
      isLast={i === treeModel.current.children.length - 1}
      collectionId={collectionId}
      onUpdateSelectedVariables={onUpdateSelectedVariables}
      onViewDetails={onViewDetails}
    />
  ))

  return (
    <div className="tree">
      <div className="tree__list-wrapper">
        <div className="tree__list">
          {nodeList()}
        </div>
      </div>
    </div>
  )
}

Tree.propTypes = {
  collectionId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedVariables: PropTypes.arrayOf(PropTypes.string).isRequired,
  variables: PropTypes.shape({}).isRequired,
  onUpdateSelectedVariables: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
}
