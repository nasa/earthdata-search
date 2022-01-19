import { uniq } from 'lodash'

export class TreeNode {
  constructor(props) {
    // Properties based on props
    this.props = props
    this.variables = this.props.variables
    this.selectedVariables = this.props.selectedVariables
    this.items = this.props.items
    this.level = this.props.level || 0
    this.parentChecked = this.props.parentChecked // Used for cascading from the top down on initial render
    this.separator = '/'
    this.onUpdateFinished = this.props.onUpdateFinished

    // Properties with default values
    this.allItems = {}
    this.checked = false
    this.children = []
    this.expanded = false

    // Properties derived from element attributes, default to undefined for caching
    this.value = undefined

    // Build remaining node properties
    this.buildNode(props)

    // Bind methods
    this.setupChildren = this.setupChildren.bind(this)
    this.updateNode = this.updateNode.bind(this)
    this.setExpanded = this.setExpanded.bind(this)
  }

  /**
   * Builds the remaining properties of the current tree item based on element attributes
   * @param {Object} item
   * @param {Object} item.element current item's XML element
   * @param {Object} item.parent current item's parent item
   */
  buildNode({
    items,
    parent = {}
  }) {
    const {
      children = [],
      id,
      label
    } = items

    this.label = label
    this.value = id || label || 'tree'
    this.variable = this.variables[id]
    this.fullValue = this.getFullValue(parent.fullValue, this.value)

    // Don't add the 'tree' element to allItems
    if (this.value !== 'tree') {
      this.parent = parent

      this.allItems = {
        ...this.allItems,
        [this.fullValue]: this
      }
    }

    this.isLeaf = children.length === 0
    this.isParent = children.length > 0
    this.isChild = parent.fullValue !== ''

    if (children.length) this.setupChildren(children)

    this.checked = this.determineChecked(
      this.selectedVariables.includes(this.value)
    )
  }

  /**
   * Sets up the children of the node
   * @param {Object} children HTMLCollection of item children
   */
  setupChildren(children) {
    Array.from(children)
      .forEach((child) => {
        // Setup new TreeNode for each child
        const childNode = new TreeNode({
          ...this.props,
          level: this.level + 1,
          items: child,
          parent: this,
          parentChecked: this.selectedVariables.includes(this.value) || this.parentChecked,
          onUpdateFinished: undefined
        })

        // Add the childNode and the childNode's allItems to this node's allItems
        this.allItems = {
          ...this.allItems,
          [childNode.fullValue]: childNode,
          ...childNode.allItems
        }

        // Add the childNode to this nodes children
        this.children.push(childNode)
      })
  }

  /**
   * Updates the node with new values
   * @param {Object} element XML tree item element
   * @param {Object} model XML data model
   * @param {Array} selectedVariables Array of checked fullValues
   */
  updateNode(item, selectedVariables) {
    this.selectedVariables = selectedVariables
    const { children } = item

    if (children.length) {
      this.updateChildren()
    }

    // Update properties that need evaluation
    this.checked = this.determineChecked(
      this.selectedVariables.includes(this.value)
    )

    if (this.onUpdateFinished) {
      this.onUpdateFinished()
    }

    return this
  }

  /**
   * Updates the current node's children
   */
  updateChildren() {
    this.children.forEach((child) => {
      // Clear parent checked as this isn't the initial render
      // eslint-disable-next-line no-param-reassign
      child.parentChecked = undefined

      child.updateNode(child, this.selectedVariables)
    })
  }

  /**
   * Seralizes the selected items into an array of the fullValues
   */
  seralize() {
    const checked = []

    Object.keys(this.allItems).forEach((key) => {
      const item = this.allItems[key]
      if (item.isLeaf && item.checked === true) checked.push(item.value)
    })

    // Only return unique items
    return uniq(checked)
  }

  /**
   * Builds the item's fullValue based on the parent
   * @param {String} parentValue parent item's fullValue
   * @param {String} value item value
   */
  getFullValue(parentValue, value) {
    if (value === 'tree') return null

    if (!parentValue && value) {
      return value
    }

    return [parentValue, value].filter(Boolean).join(this.separator)
  }

  /**
   * Determines the checked value based off the item's children
   * @param {String|Boolean} value Checked value (true/false/'indeterminate')
   */
  determineChecked(value) {
    // parentChecked used to determine checked value with cascading during initial render
    if (this.parent && this.parentChecked === true) {
      return true
    }

    // if this is a leaf, and a value does exist, return that value
    if (this.isLeaf && value != null) {
      return value
    }

    // determine if this node should be checked based on children all checked or some checked
    if (this.allChildrenChecked()) {
      return true
    }

    if (this.someChildrenChecked()) {
      return 'indeterminate'
    }

    return false
  }

  /**
   * Sets the checked property of the item and the item's children if cascading
   * @param {String|Boolean} checked new checked value
   */
  setChecked(checked) {
    let newChecked = checked

    // If the node is currently indeterminate, clicking the checkbox should switch to checked
    if (this.checked === 'indeterminate') {
      newChecked = true
    }

    // Required fields are always checked
    this.checked = newChecked

    // Set all children equal to this node
    this.children.forEach((child) => {
      child.setChecked(this.checked)
    })
  }

  /**
   * Sets the expanded property of the item
   * @param {Boolean} value new expanded value
   */
  setExpanded(value) {
    this.expanded = value
  }

  /**
   * Determines if all the items children are checked
   */
  allChildrenChecked() {
    return this.children.every((child) => child.checked === true)
  }

  /**
   * Determines if some the items children are checked
   */
  someChildrenChecked() {
    return this.children.some((child) => child.checked === true || child.checked === 'indeterminate')
  }

  /**
   * Get a unique key for this item
   */
  getKey() {
    if (this.parent) return `${this.parent.getKey()}-${this.value}`

    return this.value
  }

  /**
   * Returns the name of the item. If the item is a leaf node, returns the last portion of the name
   */
  getName() {
    const { variable = {} } = this
    const { name } = variable

    if (!this.isLeaf) {
      return name || this.label
    }

    return name.split('/').pop()
  }
}
