import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { VariableTreePanel } from '../VariableTreePanel'
import { Tree } from '../../Tree/Tree'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    accessMethods: {
      opendap: {
        keywordMappings: [
          {
            children: [{ id: 'V123456-EDSC' }],
            label: 'Keyword1'
          },
          {
            children: [{ id: 'V987654-EDSC' }],
            label: 'Keyword2'
          }
        ],
        selectedVariables: [],
        variables: {
          'V123456-EDSC': {
            meta: {},
            umm: {}
          },
          'V987654-EDSC': {
            meta: {},
            umm: {}
          }
        }
      }
    },
    collectionId: 'collectionId',
    index: 0,
    panelHeader: '',
    selectedAccessMethod: 'opendap',
    onUpdateSelectedVariables: jest.fn(),
    onViewDetails: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<VariableTreePanel {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('VariableTreePanel', () => {
  test('returns null if accessMethods are not loaded', () => {
    const { enzymeWrapper } = setup({
      accessMethods: undefined
    })

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('returns null if variables are not loaded', () => {
    const { enzymeWrapper } = setup({
      accessMethods: {
        opendap: {}
      },
      selectedAccessMethod: 'opendap'
    })

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('displays a Tree keyword mappings', () => {
    const { enzymeWrapper } = setup()

    const tree = enzymeWrapper.find(Tree)

    expect(tree.props().items).toEqual([
      {
        children: [{ id: 'V123456-EDSC' }],
        label: 'Keyword1'
      },
      {
        children: [{ id: 'V987654-EDSC' }],
        label: 'Keyword2'
      }
    ])
  })

  test('displays a Tree hierarchical mappings', () => {
    const { enzymeWrapper } = setup({
      accessMethods: {
        opendap: {
          hierarchyMappings: [
            {
              children: [{
                children: [{ id: 'V123456-EDSC' }],
                label: 'level2'
              }],
              label: 'level1'
            },
            {
              children: [{ id: 'V987654-EDSC' }],
              label: 'level3'
            }
          ],
          selectedVariables: [],
          variables: {
            'V123456-EDSC': {
              meta: {},
              umm: {}
            },
            'V987654-EDSC': {
              meta: {},
              umm: {}
            }
          }
        }
      }
    })

    const tree = enzymeWrapper.find(Tree)

    expect(tree.props().items).toEqual([
      {
        children: [{
          children: [{ id: 'V123456-EDSC' }],
          label: 'level2'
        }],
        label: 'level1'
      },
      {
        children: [{ id: 'V987654-EDSC' }],
        label: 'level3'
      }
    ])
  })

  describe('when both keyword and hierarchical mappings exist', () => {
    test('displays a Tree for both keyword and hierarchical mappings', () => {
      const { enzymeWrapper } = setup({
        accessMethods: {
          opendap: {
            hierarchyMappings: [
              {
                children: [{
                  children: [{ id: 'V123456-EDSC' }],
                  label: 'level2'
                }],
                label: 'level1'
              },
              {
                children: [{ id: 'V987654-EDSC' }],
                label: 'level3'
              }
            ],
            keywordMappings: [
              {
                children: [{ id: 'V123456-EDSC' }],
                label: 'Keyword1'
              },
              {
                children: [{ id: 'V987654-EDSC' }],
                label: 'Keyword2'
              }
            ],
            selectedVariables: [],
            variables: {
              'V123456-EDSC': {
                meta: {},
                umm: {}
              },
              'V987654-EDSC': {
                meta: {},
                umm: {}
              }
            }
          }
        }
      })

      const switcher = enzymeWrapper.find('.variable-tree-panel__tree-switcher')

      // Switcher is visible with Hierarchy disabled and Science Keyword enabled
      expect(switcher.find(Button).at(0).props().disabled).toBeTruthy()
      expect(switcher.find(Button).at(1).props().disabled).toBeFalsy()

      const tree = enzymeWrapper.find(Tree)

      // Tree defaults to hierarchy
      expect(tree.props().items).toEqual([
        {
          children: [{
            children: [{ id: 'V123456-EDSC' }],
            label: 'level2'
          }],
          label: 'level1'
        },
        {
          children: [{ id: 'V987654-EDSC' }],
          label: 'level3'
        }
      ])
    })

    test('when switching between mappings it switches the Tree', () => {
      const { enzymeWrapper } = setup({
        accessMethods: {
          opendap: {
            hierarchyMappings: [
              {
                children: [{
                  children: [{ id: 'V123456-EDSC' }],
                  label: 'level2'
                }],
                label: 'level1'
              },
              {
                children: [{ id: 'V987654-EDSC' }],
                label: 'level3'
              }
            ],
            keywordMappings: [
              {
                children: [{ id: 'V123456-EDSC' }],
                label: 'Keyword1'
              },
              {
                children: [{ id: 'V987654-EDSC' }],
                label: 'Keyword2'
              }
            ],
            selectedVariables: [],
            variables: {
              'V123456-EDSC': {
                meta: {},
                umm: {}
              },
              'V987654-EDSC': {
                meta: {},
                umm: {}
              }
            }
          }
        }
      })

      // Click Science Keyword button
      enzymeWrapper.find('.variable-tree-panel__tree-switcher').find(Button).at(1).simulate('click')
      enzymeWrapper.update()

      let switcher = enzymeWrapper.find('.variable-tree-panel__tree-switcher')

      // Switcher is visible with Hierarchy enabled and Science Keyword disabled
      expect(switcher.find(Button).at(0).props().disabled).toBeFalsy()
      expect(switcher.find(Button).at(1).props().disabled).toBeTruthy()

      let tree = enzymeWrapper.find(Tree)

      // Tree is displaying keywordMappings
      expect(tree.props().items).toEqual([
        {
          children: [{ id: 'V123456-EDSC' }],
          label: 'Keyword1'
        },
        {
          children: [{ id: 'V987654-EDSC' }],
          label: 'Keyword2'
        }
      ])

      // Click Hierarchy button
      enzymeWrapper.find('.variable-tree-panel__tree-switcher').find(Button).at(0).simulate('click')
      enzymeWrapper.update()

      switcher = enzymeWrapper.find('.variable-tree-panel__tree-switcher')

      // Switcher is visible with Hierarchy disabled and Science Keyword enabled
      expect(switcher.find(Button).at(0).props().disabled).toBeTruthy()
      expect(switcher.find(Button).at(1).props().disabled).toBeFalsy()

      tree = enzymeWrapper.find(Tree)

      // Tree is displaying hierarchyMappings
      expect(tree.props().items).toEqual([
        {
          children: [{
            children: [{ id: 'V123456-EDSC' }],
            label: 'level2'
          }],
          label: 'level1'
        },
        {
          children: [{ id: 'V987654-EDSC' }],
          label: 'level3'
        }
      ])
    })
  })
})
