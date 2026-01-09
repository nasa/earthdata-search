import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import TreeItem from '../TreeItem'

const defaultItem = {
  children: [{
    children: [],
    checked: true,
    expanded: true,
    fullValue: 'Parent1/Child1',
    isLeaf: true,
    label: 'Child 1',
    level: 2,
    value: 'Child1',
    variable: { mock: 'variable' },
    getKey: jest.fn(),
    getName: jest.fn().mockReturnValue('Child 1'),
    setChecked: jest.fn(),
    setExpanded: jest.fn()
  }],
  checked: true,
  expanded: true,
  isParent: true,
  fullValue: 'Parent1',
  label: 'Parent 1',
  level: 1,
  value: 'Parent1',
  getKey: jest.fn(),
  getName: jest.fn().mockReturnValue('Parent 1'),
  setChecked: jest.fn(),
  setExpanded: jest.fn()
}

const setup = setupTest({
  Component: TreeItem,
  defaultProps: {
    collectionId: 'collectionId',
    item: {
      ...defaultItem
    },
    index: 0,
    isFirst: true,
    isLast: true,
    onChange: jest.fn(),
    onUpdateSelectedVariables: jest.fn(),
    onViewDetails: jest.fn()
  }
})

describe('TreeItem component', () => {
  test('renders a checkbox element', () => {
    setup()

    const checkbox = screen.getByRole('checkbox', { name: 'Parent 1' })
    expect(checkbox).toBeChecked()
    expect(checkbox).toHaveAttribute('id', 'Parent1')
    expect(checkbox).toHaveAttribute('value', 'Parent1')

    expect(screen.getByText('Parent 1')).toBeInTheDocument()
  })

  test('renders a child TreeItem', () => {
    setup()

    const checkbox = screen.getByRole('checkbox', { name: 'Child 1' })
    expect(checkbox).toBeChecked()
    expect(checkbox).toHaveAttribute('id', 'Parent1/Child1')
    expect(checkbox).toHaveAttribute('value', 'Child1')

    expect(screen.getByText('Child 1')).toBeInTheDocument()
  })

  test('checking a checkbox calls setChecked and onChange', async () => {
    const { props, user } = setup({
      overrideProps: {
        item: {
          ...defaultItem,
          checked: false
        }
      }
    })

    const checkbox = screen.getByRole('checkbox', { name: 'Parent 1' })
    await user.click(checkbox)

    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange).toHaveBeenCalledWith()

    expect(props.item.setChecked).toHaveBeenCalledTimes(1)
    expect(props.item.setChecked).toHaveBeenCalledWith(true)

    expect(props.onUpdateSelectedVariables).toHaveBeenCalledTimes(0)
  })

  test('unchecking a checkbox calls onUpdateSelectedVariables', async () => {
    const { props, user } = setup({
      overrideProps: {
        item: {
          ...defaultItem,
          selectedVariables: ['Parent1']
        }
      }
    })

    const checkbox = screen.getByRole('checkbox', { name: 'Parent 1' })
    await user.click(checkbox)

    expect(props.onChange).toHaveBeenCalledTimes(0)
    expect(props.item.setChecked).toHaveBeenCalledTimes(0)

    expect(props.onUpdateSelectedVariables).toHaveBeenCalledTimes(1)
    expect(props.onUpdateSelectedVariables).toHaveBeenCalledWith([], 'collectionId')
  })

  test('clicking expand/collapse button calls setExpanded', async () => {
    const { props, user } = setup()

    const collapseButton = screen.getByRole('button', { name: 'Collapse Parent 1' })
    await user.click(collapseButton)

    expect(props.item.setExpanded).toHaveBeenCalledTimes(1)
    expect(props.item.setExpanded).toHaveBeenCalledWith(false)

    jest.clearAllMocks()

    const expandButton = screen.getByRole('button', { name: 'Expand Parent 1' })
    await user.click(expandButton)

    expect(props.item.setExpanded).toHaveBeenCalledTimes(1)
    expect(props.item.setExpanded).toHaveBeenCalledWith(true)
  })

  test('clicking the info icon calls onViewDetails', async () => {
    const { props, user } = setup()

    const button = screen.getByRole('button', { name: 'View details' })
    await user.click(button)

    expect(props.onViewDetails).toHaveBeenCalledTimes(1)
    expect(props.onViewDetails).toHaveBeenCalledWith({ mock: 'variable' }, 0)
  })

  test('adds the level modifier classname', () => {
    const { container } = setup({
      overrideProps: {
        item: {
          ...defaultItem,
          level: 2
        }
      }
    })

    expect(container.childNodes[0].className).toContain('tree-item--child-2')
  })

  describe('when the item is a parent', () => {
    test('adds the modifier classname', () => {
      const { container } = setup()

      expect(container.childNodes[0].className).toContain('tree-item--is-parent')
    })
  })

  describe('when the item is first in the list', () => {
    test('adds the modifier classname', () => {
      const { container } = setup({
        overrideProps: {
          isFirst: true,
          isLast: false
        }
      })

      expect(container.childNodes[0].className).toContain('tree-item--is-first')
      expect(container.childNodes[0].className).not.toContain('tree-item--is-last')
    })
  })

  describe('when the item is last in the list', () => {
    test('adds the modifier classname', () => {
      const { container } = setup({
        overrideProps: {
          isFirst: false,
          isLast: true
        }
      })

      expect(container.childNodes[0].className).toContain('tree-item--is-last')
      expect(container.childNodes[0].className).not.toContain('tree-item--is-first')
    })
  })

  describe('when the item is open', () => {
    test('adds the modifier classname', () => {
      const { container } = setup()

      expect(container.childNodes[0].className).toContain('tree-item--is-open')
    })
  })

  describe('when the item is closed', () => {
    test('does not add the modifier classname', () => {
      const { container } = setup({
        overrideProps: {
          item: {
            ...defaultItem,
            expanded: false
          }
        }
      })

      expect(container.childNodes[0].className).not.toContain('tree-item--is-open')
    })
  })
})
