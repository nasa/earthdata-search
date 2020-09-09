import { TreeNode } from '../TreeNode'

const items = [
  {
    children: [{
      id: 'item1'
    }],
    label: 'Parent 1'
  },
  {
    children: [{
      id: 'item1'
    }, {
      id: 'item2'
    }, {
      id: 'item3'
    }],
    label: 'Parent 2'
  }
]

const variables = {
  item1: {
    conceptId: 'item1',
    definition: 'Item 1 Definition',
    longName: 'Item 1 long name',
    name: 'Item1_Name'
  },
  item2: {
    conceptId: 'item2',
    definition: 'Item 2 Definition',
    longName: 'Item 2 long name',
    name: 'Item2_Name'
  },
  item3: {
    conceptId: 'item3',
    definition: 'Item 3 Definition',
    longName: 'Item 3 long name',
    name: 'Item3_Name'
  }
}

describe('TreeNode', () => {
  test('sets up allItems', () => {
    const selectedVariables = ['item1', 'item2']

    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables,
      variables
    })

    expect(treeNode.allItems['Parent 1'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 1'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 1'].level).toEqual(1)
    expect(treeNode.allItems['Parent 1'].value).toEqual('Parent 1')

    expect(treeNode.allItems['Parent 1/item1'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 1/item1'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 1/item1'].level).toEqual(2)
    expect(treeNode.allItems['Parent 1/item1'].value).toEqual('item1')

    expect(treeNode.allItems['Parent 2'].checked).toEqual('indeterminate')
    expect(treeNode.allItems['Parent 2'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2'].level).toEqual(1)
    expect(treeNode.allItems['Parent 2'].value).toEqual('Parent 2')

    expect(treeNode.allItems['Parent 2/item2'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 2/item2'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2/item2'].level).toEqual(2)
    expect(treeNode.allItems['Parent 2/item2'].value).toEqual('item2')

    expect(treeNode.allItems['Parent 2/item3'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 2/item3'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2/item3'].level).toEqual(2)
    expect(treeNode.allItems['Parent 2/item3'].value).toEqual('item3')
  })

  test('updateNode updates allItems', () => {
    const selectedVariables = ['item1', 'item2']

    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables,
      variables
    })

    const newSelectedValues = []
    treeNode.updateNode({ children: items }, newSelectedValues)

    expect(treeNode.allItems['Parent 1'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 1'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 1'].level).toEqual(1)
    expect(treeNode.allItems['Parent 1'].value).toEqual('Parent 1')

    expect(treeNode.allItems['Parent 1/item1'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 1/item1'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 1/item1'].level).toEqual(2)
    expect(treeNode.allItems['Parent 1/item1'].value).toEqual('item1')

    expect(treeNode.allItems['Parent 2'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 2'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2'].level).toEqual(1)
    expect(treeNode.allItems['Parent 2'].value).toEqual('Parent 2')

    expect(treeNode.allItems['Parent 2/item2'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 2/item2'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2/item2'].level).toEqual(2)
    expect(treeNode.allItems['Parent 2/item2'].value).toEqual('item2')

    expect(treeNode.allItems['Parent 2/item3'].checked).toEqual(false)
    expect(treeNode.allItems['Parent 2/item3'].expanded).toEqual(false)
    expect(treeNode.allItems['Parent 2/item3'].level).toEqual(2)
    expect(treeNode.allItems['Parent 2/item3'].value).toEqual('item3')
  })

  test('selecting an indeterminateparents selects all children', () => {
    const selectedVariables = ['item1', 'item2']

    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables,
      variables
    })

    treeNode.allItems['Parent 2'].setChecked(true)

    expect(treeNode.allItems['Parent 2'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 2/item2'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 2/item3'].checked).toEqual(true)
  })

  test('updates the expanded property', () => {
    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables: [],
      variables
    })

    expect(treeNode.allItems['Parent 1'].expanded).toEqual(false)

    treeNode.allItems['Parent 1'].setExpanded(true)

    expect(treeNode.allItems['Parent 1'].expanded).toEqual(true)
  })

  test('returns the seralized data', () => {
    const selectedVariables = ['item1', 'item2']

    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables,
      variables
    })

    expect(treeNode.seralize()).toEqual(selectedVariables)
  })

  test('checks all leaf nodes with the same value', () => {
    const treeNode = new TreeNode({
      items: { children: items },
      selectedVariables: [],
      variables
    })

    treeNode.allItems['Parent 1/item1'].setChecked(true)
    // Calling updateNode with the new selectedVariables will set all matching items as checked
    treeNode.updateNode({ children: items }, ['item1'])

    expect(treeNode.allItems['Parent 1/item1'].checked).toEqual(true)
    expect(treeNode.allItems['Parent 2/item1'].checked).toEqual(true)
  })

  describe('getKey', () => {
    test('returns the value as the key', () => {
      const selectedVariables = ['item1', 'item2']

      const treeNode = new TreeNode({
        items: { children: items },
        selectedVariables,
        variables
      })

      expect(treeNode.allItems['Parent 1'].getKey()).toEqual('tree-Parent 1')
    })

    test('returns the value concatenated with the parent key', () => {
      const selectedVariables = ['item1', 'item2']

      const treeNode = new TreeNode({
        items: { children: items },
        selectedVariables,
        variables
      })

      expect(treeNode.allItems['Parent 1/item1'].getKey()).toEqual('tree-Parent 1-item1')
    })
  })

  describe('getName', () => {
    test('returns the name', () => {
      const selectedVariables = ['item1', 'item2']

      const treeNode = new TreeNode({
        items: { children: items },
        selectedVariables,
        variables
      })

      expect(treeNode.allItems['Parent 1'].getName()).toEqual('Parent 1')
    })

    test('returns the truncated name for a leaf node', () => {
      const selectedVariables = ['item1', 'item2']

      const treeNode = new TreeNode({
        items: { children: items },
        selectedVariables,
        variables
      })

      expect(treeNode.allItems['Parent 1/item1'].getName()).toEqual('Item1_Name')
    })
  })
})
