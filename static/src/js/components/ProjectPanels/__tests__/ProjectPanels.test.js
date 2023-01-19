import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import ProjectPanels from '../ProjectPanels'
import PanelItem from '../../Panels/PanelItem'
import PanelGroup from '../../Panels/PanelGroup'
import PanelSection from '../../Panels/PanelSection'
import AccessMethod from '../../AccessMethod/AccessMethod'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

const opendapProps = {
  project: {
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          granules: {},
          accessMethods: {
            opendap: {
              variables: {
                variableId1: {
                  meta: {},
                  umm: {},
                  associations: {}
                },
                variableId2: {
                  meta: {},
                  umm: {},
                  associations: {}
                }
              },
              selectedVariables: []
            }
          },
          selectedAccessMethod: 'opendap'
        }
      }
    }
  }
}

function setup(overrideProps) {
  const props = {
    projectCollectionsMetadata: {
      collectionId: {
        dataset_id: 'test dataset id'
      }
    },
    dataQualitySummaries: {},
    focusedCollectionId: '',
    focusedGranuleId: '',
    granulesMetadata: {},
    granulesQueries: {},
    portal: {},
    project: {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {},
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        }
      }
    },
    location: {
      search: ''
    },
    panels: {
      activePanel: '0.0.0',
      isOpen: true
    },
    shapefileId: '',
    spatial: {},
    temporal: {},
    overrideTemporal: {},
    onChangePath: jest.fn(),
    onSelectAccessMethod: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    onUpdateAccessMethod: jest.fn(),
    onChangeGranulePageNum: jest.fn(),
    onSetActivePanelGroup: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onAddGranuleToProjectCollection: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onChangeProjectGranulePageNum: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ProjectPanels {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectPanels component', () => {
  describe('componentWillReceiveProps', () => {
    test('sets selectedVariables for opendap access method', () => {
      const { enzymeWrapper } = setup(opendapProps)

      enzymeWrapper.setProps({
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                granules: {},
                accessMethods: {
                  opendap: {
                    selectedVariables: ['variableId1']
                  }
                },
                selectedAccessMethod: 'opendap'
              }
            }
          }
        }
      })

      expect(enzymeWrapper.state().selectedVariables).toEqual({
        collectionId: ['variableId1']
      })
    })

    test('does not set selectedVariables for opendap access methods when there are no selected variables', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps(opendapProps)

      expect(enzymeWrapper.state().selectedVariables).toEqual({})
    })

    test('does not set selectedVariables for non-opendap access methods', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({})

      expect(enzymeWrapper.state().selectedVariables).toEqual({})
    })
  })

  test('onPanelOpen calls onTogglePanels', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().onPanelOpen()

    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(true)
  })

  test('onPanelClose calls onTogglePanels', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().onPanelClose()

    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(false)
  })

  test('onChangePanel calls onUpdateFocusedCollection', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().onChangePanel('0.0.1')

    expect(props.onUpdateFocusedCollection).toHaveBeenCalledTimes(1)
    expect(props.onUpdateFocusedCollection).toHaveBeenCalledWith('collectionId')
    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(true)
    expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
    expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.1')
  })

  describe('onCheckboxChange', () => {
    test('check all variables updates the state', () => {
      const { enzymeWrapper } = setup(opendapProps)

      enzymeWrapper.setState({
        variables: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          },
          variableId2: {
            meta: {},
            umm: {},
            associations: {}
          }
        }
      })
      enzymeWrapper.instance().onCheckboxChange({ target: { checked: true } }, 'all', 'collectionId')

      expect(enzymeWrapper.state().selectedVariables).toEqual({
        collectionId: ['variableId1', 'variableId2']
      })
    })

    test('uncheck all variables updates the state', () => {
      const { enzymeWrapper } = setup(opendapProps)

      enzymeWrapper.setState({
        selectedVariables: {
          collectionId: ['variableId1', 'variableId2']
        },
        variables: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          },
          variableId2: {
            meta: {},
            umm: {},
            associations: {}
          }
        }
      })
      enzymeWrapper.instance().onCheckboxChange({ target: { checked: false } }, 'all', 'collectionId')

      expect(enzymeWrapper.state().selectedVariables).toEqual({
        collectionId: []
      })
    })

    test('checking a single variable updates the state', () => {
      const { enzymeWrapper } = setup(opendapProps)

      enzymeWrapper.setState({
        selectedVariable: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          }
        },
        variables: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          },
          variableId2: {
            meta: {},
            umm: {},
            associations: {}
          }
        }
      })
      enzymeWrapper.instance().onCheckboxChange({ target: { checked: true } }, 'variableId1', 'collectionId')

      expect(enzymeWrapper.state().selectedVariables).toEqual({
        collectionId: ['variableId1']
      })
    })

    test('unchecking a single variable updates the state', () => {
      const { enzymeWrapper } = setup(opendapProps)

      enzymeWrapper.setState({
        selectedVariable: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          }
        },
        selectedVariables: {
          collectionId: ['variableId1', 'variableId2']
        },
        variables: {
          variableId1: {
            meta: {},
            umm: {},
            associations: {}
          },
          variableId2: {
            meta: {},
            umm: {},
            associations: {}
          }
        }
      })
      enzymeWrapper.instance().onCheckboxChange({ target: { checked: false } }, 'variableId1', 'collectionId')

      expect(enzymeWrapper.state().selectedVariables).toEqual({
        collectionId: ['variableId2']
      })
    })
  })

  test('onViewDetails sets the state and calls onChangePanel', () => {
    const { enzymeWrapper, props } = setup(opendapProps)

    enzymeWrapper.instance().onViewDetails({
      meta: {},
      umm: {},
      associations: {}
    }, 1)

    expect(enzymeWrapper.state().selectedVariable).toEqual({
      meta: {},
      umm: {},
      associations: {}
    })

    expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
    expect(props.onSetActivePanel).toHaveBeenCalledWith('0.1.2')

    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(true)
  })

  test('backToOptions sets the state', () => {
    const { enzymeWrapper } = setup(opendapProps)

    enzymeWrapper.setState({
      variables: {
        variableId1: {
          meta: {},
          umm: {},
          associations: {}
        }
      }
    })

    enzymeWrapper.instance().backToOptions()

    expect(enzymeWrapper.state().variables).toEqual(null)
  })

  test('clearSelectedVariable sets the state and calls onChangePanel', () => {
    const { enzymeWrapper, props } = setup(opendapProps)

    enzymeWrapper.setState({
      selectedVariable: {
        meta: {},
        umm: {},
        associations: {}
      }
    })

    enzymeWrapper.instance().clearSelectedVariable('0.0.2')

    expect(enzymeWrapper.state().selectedVariable).toEqual(null)

    expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
    expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.2')

    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(true)
  })

  describe('canResetForm', () => {
    test('returns false if no access methods exist', () => {
      const { enzymeWrapper } = setup()

      const accessMethods = undefined
      const selectedAccessMethod = undefined
      const result = enzymeWrapper.instance().canResetForm(accessMethods, selectedAccessMethod)

      expect(result).toBeFalsy()
    })

    test('returns false if no selected access method exists', () => {
      const { enzymeWrapper } = setup()

      const accessMethods = { download: { type: 'download' } }
      const selectedAccessMethod = undefined
      const result = enzymeWrapper.instance().canResetForm(accessMethods, selectedAccessMethod)

      expect(result).toBeFalsy()
    })

    test('returns false if the selected access method does not use echo forms', () => {
      const { enzymeWrapper } = setup()

      const accessMethods = { download: { type: 'download' } }
      const selectedAccessMethod = 'download'
      const result = enzymeWrapper.instance().canResetForm(accessMethods, selectedAccessMethod)

      expect(result).toBeFalsy()
    })

    test('returns true for ESI access methods', () => {
      const { enzymeWrapper } = setup()

      const accessMethods = { esi0: { type: 'ESI' } }
      const selectedAccessMethod = 'esi0'
      const result = enzymeWrapper.instance().canResetForm(accessMethods, selectedAccessMethod)

      expect(result).toBeTruthy()
    })

    test('returns true for ECHO ORDERS access methods', () => {
      const { enzymeWrapper } = setup()

      const accessMethods = { echoOrder0: { type: 'ECHO ORDERS' } }
      const selectedAccessMethod = 'echoOrder0'
      const result = enzymeWrapper.instance().canResetForm(accessMethods, selectedAccessMethod)

      expect(result).toBeTruthy()
    })
  })

  test('resetForm calls onUpdateAccessMethod', () => {
    const { enzymeWrapper, props } = setup({
      project: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              accessMethods: {
                esi0: {
                  model: 'mock model',
                  rawModel: 'mock rawModel'
                }
              },
              selectedAccessMethod: 'esi0'
            }
          }
        }
      }
    })

    enzymeWrapper.instance().resetForm('collectionId', 'esi0')

    expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
    expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      method: {
        esi0: {
          model: undefined,
          rawModel: undefined
        }
      }
    })
  })

  describe('when on the access method panel', () => {
    describe('when viewing a CSDA collection', () => {
      test('shows a message and opens a modal for more information about the CSDA program', () => {
        const { enzymeWrapper, props } = setup({
          projectCollectionsMetadata: {
            collectionId: {
              isCSDA: true
            }
          }
        })

        const accessMethodPanelGroup = enzymeWrapper.find(PanelSection).at(1).find(PanelGroup).at(0)
        const moreInfoButton = accessMethodPanelGroup.props().headerMessage.props.children[3]

        moreInfoButton.props.onClick()

        expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
      })
    })

    describe('when only global temporal is provided', () => {
      test('passes the temporal to AccessMethod', () => {
        const expectedTemporal = {
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        }

        const { enzymeWrapper } = setup({
          temporal: expectedTemporal
        })

        expect(enzymeWrapper.find(AccessMethod).props().temporal).toEqual({
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        })
      })
    })

    describe('when overrideTemporal is provided', () => {
      test('passes the overrideTemporal to AccessMethod', () => {
        const expectedTemporal = {
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        }

        const { enzymeWrapper } = setup({
          overrideTemporal: expectedTemporal,
          temporal: {
            endDate: '2022-01-31T23:59:59.999Z',
            startDate: '2022-01-01T00:00:00.000Z',
            recurringDayStart: '',
            recurringDayEnd: '',
            isRecurring: false
          }
        })

        expect(enzymeWrapper.find(AccessMethod).props().temporal).toEqual({
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        })
      })
    })

    describe('when granuleTemporal is provided', () => {
      test('passes the granuleTemporal to AccessMethod', () => {
        const expectedTemporal = {
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        }

        const { enzymeWrapper } = setup({
          granulesQueries: {
            collectionId: {
              granules: {
                temporal: expectedTemporal
              }
            }
          },
          temporal: {
            endDate: '2022-01-31T23:59:59.999Z',
            startDate: '2022-01-01T00:00:00.000Z',
            recurringDayStart: '',
            recurringDayEnd: '',
            isRecurring: false
          }
        })

        expect(enzymeWrapper.find(AccessMethod).props().temporal).toEqual({
          endDate: '2022-01-15T23:59:59.999Z',
          startDate: '2022-01-10T00:00:00.000Z',
          recurringDayStart: '',
          recurringDayEnd: '',
          isRecurring: false
        })
      })
    })
  })

  describe('when on the collection panel', () => {
    describe('when viewing a CSDA collection', () => {
      test('shows a message and opens a modal for more information about the CSDA program', () => {
        const { enzymeWrapper, props } = setup({
          projectCollectionsMetadata: {
            collectionId: {
              isCSDA: true
            }
          }
        })

        const infoPanelGroup = enzymeWrapper.find(PanelSection).at(1).find(PanelGroup).at(0)
        const moreInfoButton = infoPanelGroup.props().headerMessage.props.children[3]

        moreInfoButton.props.onClick()

        expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
      })
    })
  })

  describe('when viewing a cloud-hosted collection', () => {
    test('an on-prem duplicate collection notice appears', () => {
      const { enzymeWrapper, props } = setup({
        project: {
          collections: {
            allIds: ['C2208418228-POCLOUD'],
            byId: {
              'C2208418228-POCLOUD': {
                accessMethods: {
                  download: {
                    isValid: true,
                    type: 'download'
                  }
                },
                granules: {},
                isVisible: true
              }
            }
          }
        },
        projectCollectionsMetadata: {
          'C2208418228-POCLOUD': {
            cloudHosted: true,
            duplicateCollections: ['C1972954180-PODAAC'],
            id: 'C2208418228-POCLOUD'
          }
        }
      })

      const panelItems = enzymeWrapper.find(PanelItem)

      const panelItem = panelItems.findWhere((node) => (
        node.props().header?.type.name === 'DataQualitySummary'
      )).first()

      const { header } = panelItem.props()
      expect(header.props.dataQualityHeader).toBe('Important data availability information')
      expect(header.props.dataQualitySummaries).toHaveLength(1)
      const { id, summary } = header.props.dataQualitySummaries[0]
      expect(id).toBe('duplicate-collection')

      expect(shallow(summary.props.children[0]).html()).toBe('<span>This dataset is hosted in the Earthdata Cloud. The dataset is also </span>')

      const link = summary.props.children[1]
      expect(link.props.children).toBe('hosted in a NASA datacenter')
      expect(link.props.to.pathname).toBe('/search/granules')
      expect(link.props.to.search).toBe('?p=C1972954180-PODAAC!C2208418228-POCLOUD')

      link.props.onClick()
      expect(props.onChangePath).toBeCalledTimes(1)
      expect(props.onChangePath).toBeCalledWith('/search/granules?p=C1972954180-PODAAC!C2208418228-POCLOUD')

      expect(shallow(summary.props.children[2]).html()).toBe('<span>, and may have different services available.</span>')
    })
  })

  describe('when viewing an on-prem collection', () => {
    test('a cloud-hosted duplicate collection notice appears', () => {
      const { enzymeWrapper, props } = setup({
        project: {
          collections: {
            allIds: ['C1972954180-PODAAC'],
            byId: {
              'C1972954180-PODAAC': {
                accessMethods: {
                  download: {
                    isValid: true,
                    type: 'download'
                  }
                },
                granules: {},
                isVisible: true
              }
            }
          }
        },
        projectCollectionsMetadata: {
          'C1972954180-PODAAC': {
            cloudHosted: false,
            duplicateCollections: ['C2208418228-POCLOUD'],
            id: 'C1972954180-PODAAC'
          }
        }
      })

      const panelItems = enzymeWrapper.find(PanelItem)

      const panelItem = panelItems.findWhere((node) => (
        node.props().header?.type.name === 'DataQualitySummary'
      )).first()

      const { header } = panelItem.props()
      expect(header.props.dataQualityHeader).toBe('Important data availability information')
      expect(header.props.dataQualitySummaries).toHaveLength(1)
      const { id, summary } = header.props.dataQualitySummaries[0]
      expect(id).toBe('duplicate-collection')

      expect(shallow(summary.props.children[0]).html()).toBe('<span>This dataset is hosted inside a NASA datacenter. The dataset is also </span>')

      const link = summary.props.children[1]
      expect(link.props.children).toBe('hosted in the Earthdata Cloud')
      expect(link.props.to.pathname).toBe('/search/granules')
      expect(link.props.to.search).toBe('?p=C2208418228-POCLOUD!C1972954180-PODAAC')

      link.props.onClick()
      expect(props.onChangePath).toBeCalledTimes(1)
      expect(props.onChangePath).toBeCalledWith('/search/granules?p=C2208418228-POCLOUD!C1972954180-PODAAC')

      expect(shallow(summary.props.children[2]).html()).toBe('<span>, and may have different services available.</span>')
    })
  })
})
