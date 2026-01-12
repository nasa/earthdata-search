import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { VariableTreePanel } from '../VariableTreePanel'
import Tree from '../../Tree/Tree'

jest.mock('../../Tree/Tree', () => jest.fn(() => null))

const setup = setupTest({
  Component: VariableTreePanel,
  defaultProps: {
    accessMethods: {
      opendap: {
        keywordMappings: [{
          children: [{
            id: 'V123456-EDSC'
          }],
          label: 'Keyword1'
        }, {
          children: [{
            id: 'V987654-EDSC'
          }],
          label: 'Keyword2'
        }],
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
    onUpdateSelectedVariables: jest.fn(),
    onViewDetails: jest.fn(),
    panelHeader: '',
    selectedAccessMethod: 'opendap'
  }
})

describe('VariableTreePanel', () => {
  test('displays a message if accessMethods are not loaded', () => {
    setup({
      overrideProps: {
        accessMethods: null,
        selectedAccessMethod: null
      }
    })

    expect(screen.getByText('No variables available for selected access method')).toBeInTheDocument()
  })

  test('displays a message if variables are not loaded', () => {
    setup({
      overrideProps: {
        accessMethods: {
          opendap: {}
        },
        selectedAccessMethod: 'opendap'
      }
    })

    expect(screen.getByText('No variables available for selected access method')).toBeInTheDocument()
  })

  test('displays a Tree keyword mappings', () => {
    const { props } = setup()

    expect(Tree).toHaveBeenCalledTimes(1)
    expect(Tree).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      index: 0,
      items: [{
        children: [{ id: 'V123456-EDSC' }],
        label: 'Keyword1'
      }, {
        children: [{ id: 'V987654-EDSC' }],
        label: 'Keyword2'
      }],
      onUpdateSelectedVariables: props.onUpdateSelectedVariables,
      onViewDetails: props.onViewDetails,
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
    }, {})
  })

  test('displays a message when there are no items to display', () => {
    setup({
      overrideProps: {
        accessMethods: {
          opendap: {
            hierarchyMappings: [],
            keywordMappings: [],
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
      }
    })

    expect(screen.getByText('No variables available for selected access method')).toBeInTheDocument()
  })

  test('displays a Tree hierarchical mappings', () => {
    const { props } = setup({
      overrideProps: {
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
      }
    })

    expect(Tree).toHaveBeenCalledTimes(1)
    expect(Tree).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      index: 0,
      items: [{
        children: [{
          children: [{ id: 'V123456-EDSC' }],
          label: 'level2'
        }],
        label: 'level1'
      }, {
        children: [{ id: 'V987654-EDSC' }],
        label: 'level3'
      }],
      onUpdateSelectedVariables: props.onUpdateSelectedVariables,
      onViewDetails: props.onViewDetails,
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
    }, {})
  })

  describe('when both keyword and hierarchical mappings exist', () => {
    test('displays a Tree for both keyword and hierarchical mappings', () => {
      const { props } = setup({
        overrideProps: {
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
        }
      })

      const hierarchyButton = screen.getByRole('button', { name: 'Hierarchy' })
      const scienceKeywordButton = screen.getByRole('button', { name: 'Science Keyword' })

      expect(hierarchyButton).toBeInTheDocument()
      expect(scienceKeywordButton).toBeInTheDocument()

      expect(hierarchyButton.className).toContain('is-active')
      expect(scienceKeywordButton.className).not.toContain('is-active')

      // Tree is displaying hierarchyMappings
      expect(Tree).toHaveBeenCalledTimes(1)
      expect(Tree).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        index: 0,
        items: [{
          children: [{
            children: [{ id: 'V123456-EDSC' }],
            label: 'level2'
          }],
          label: 'level1'
        }, {
          children: [{ id: 'V987654-EDSC' }],
          label: 'level3'
        }],
        onUpdateSelectedVariables: props.onUpdateSelectedVariables,
        onViewDetails: props.onViewDetails,
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
      }, {})
    })

    describe('when switching between mappings', () => {
      test('switches to Science Keyword', async () => {
        const { props, user } = setup({
          overrideProps: {
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
          }
        })

        const hierarchyButton = screen.getByRole('button', { name: 'Hierarchy' })
        const scienceKeywordButton = screen.getByRole('button', { name: 'Science Keyword' })

        jest.clearAllMocks()

        await user.click(scienceKeywordButton)

        expect(hierarchyButton.className).not.toContain('is-active')
        expect(scienceKeywordButton.className).toContain('is-active')

        // Tree is displaying keywordMappings
        expect(Tree).toHaveBeenCalledTimes(1)
        expect(Tree).toHaveBeenCalledWith({
          collectionId: 'collectionId',
          index: 0,
          items: [{
            children: [{ id: 'V123456-EDSC' }],
            label: 'Keyword1'
          }, {
            children: [{ id: 'V987654-EDSC' }],
            label: 'Keyword2'
          }],
          onUpdateSelectedVariables: props.onUpdateSelectedVariables,
          onViewDetails: props.onViewDetails,
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
        }, {})
      })

      test('switches to Hierarchy', async () => {
        const { props, user } = setup({
          overrideProps: {
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
          }
        })

        const hierarchyButton = screen.getByRole('button', { name: 'Hierarchy' })
        const scienceKeywordButton = screen.getByRole('button', { name: 'Science Keyword' })

        // Switch to Science Keyword first so we can test switching back to Hierarchy
        await user.click(scienceKeywordButton)

        jest.clearAllMocks()

        // Then switch back to Hierarchy
        await user.click(hierarchyButton)

        expect(hierarchyButton.className).toContain('is-active')
        expect(scienceKeywordButton.className).not.toContain('is-active')

        // Tree is displaying hierarchyMappings
        expect(Tree).toHaveBeenCalledTimes(1)
        expect(Tree).toHaveBeenCalledWith({
          collectionId: 'collectionId',
          index: 0,
          items: [{
            children: [{
              children: [{ id: 'V123456-EDSC' }],
              label: 'level2'
            }],
            label: 'level1'
          }, {
            children: [{ id: 'V987654-EDSC' }],
            label: 'level3'
          }],
          onUpdateSelectedVariables: props.onUpdateSelectedVariables,
          onViewDetails: props.onViewDetails,
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
        }, {})
      })
    })
  })
})
