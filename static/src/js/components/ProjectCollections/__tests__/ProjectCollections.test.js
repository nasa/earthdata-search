import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Button from '../../Button/Button'
import ProjectCollections from '../ProjectCollections'
import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectHeader from '../ProjectHeader'
import projections from '../../../util/map/projections'

import * as isProjectValid from '../../../util/isProjectValid'
import { validAccessMethod } from '../../../util/accessMethods'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    collectionsQuery: {
      byId: {
        collectionId1: {
          granules: {}
        },
        collectionId2: {
          granules: {}
        }
      },
      pageNum: 1
    },
    handoffs: {},
    mapProjection: projections.geographic,
    project: {
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    },
    projectCollectionsMetadata: {
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    },
    projectCollectionsIds: ['collectionId1', 'collectionId2'],
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    savedProject: {
      projectId: 1,
      name: 'test name'
    },
    onMetricsDataAccess: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ProjectCollections {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(ProjectHeader).length).toBe(1)
    expect(enzymeWrapper.find(ProjectHeader).props().collectionsQuery)
      .toEqual(props.collectionsQuery)
    expect(enzymeWrapper.find(ProjectHeader).props().project).toEqual({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    })
    expect(enzymeWrapper.find(ProjectHeader).props().savedProject).toEqual({
      projectId: 1,
      name: 'test name'
    })

    expect(enzymeWrapper.find(ProjectCollectionsList).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollectionsList).props().collectionsMetadata).toEqual({
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    })
    expect(enzymeWrapper.find(ProjectCollectionsList).props().project).toEqual({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    })

    expect(enzymeWrapper.find(ProjectCollectionsList).props().onMetricsDataAccess)
      .toEqual(props.onMetricsDataAccess)

    expect(enzymeWrapper.find('.project-collections__footer').length).toBe(1)
  })

  describe('help text', () => {
    describe('when all project collections are valid', () => {
      test('displays the correct help text', () => {
        jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod
        }))
        const { enzymeWrapper } = setup()

        const message = enzymeWrapper.find('.project-collections__footer-message')

        expect(message.text()).toEqual(`Click ${String.fromCharCode(8220)}Edit Options${String.fromCharCode(8221)} above to customize the output for each project.`)
      })
    })

    describe('when an access method has not been selected', () => {
      test('displays the correct help text', () => {
        jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false
        }))
        const { enzymeWrapper } = setup()

        const message = enzymeWrapper.find('.project-collections__footer-message')

        expect(message.text()).toEqual('Select a data access method for each collection in your project before downloading.')
      })
    })

    describe('when an access method needs customization', () => {
      test('displays the correct help text', () => {
        jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          needsCustomization: true
        }))
        const { enzymeWrapper } = setup()

        const message = enzymeWrapper.find('.project-collections__footer-message')

        expect(message.text()).toEqual('One or more collections in your project have an access method selected that requires customization options. Please select a customization option or choose a different access method.')
      })
    })

    describe('when a project collection has too many granules', () => {
      test('displays the correct help text', () => {
        jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          tooManyGranules: true
        }))
        const { enzymeWrapper } = setup()

        const message = enzymeWrapper.find('.project-collections__footer-message')

        expect(message.text()).toEqual('One or more collections in your project contains too many granules. Adjust temporal constraints or remove the collections before downloading.')
      })
    })

    describe('when a project collection has no granules', () => {
      test('displays the correct help text', () => {
        jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          noGranules: true
        }))
        const { enzymeWrapper } = setup()

        const message = enzymeWrapper.find('.project-collections__footer-message')

        expect(message.text()).toEqual('One or more collections in your project does not contain granules. Adjust temporal constraints or remove the collections before downloading.')
      })
    })
  })

  describe('Download Data button', () => {
    test('is enabled when the project is valid', () => {
      jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
        ...validAccessMethod
      }))
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper.find(Button)

      expect(button.props().disabled).toBeFalsy()
    })

    test('is disabled when the project is invalid', () => {
      jest.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
        ...validAccessMethod,
        valid: false
      }))
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper.find(Button)

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('componentDidUpdate', () => {
    test('calls onMetricsDataAccess and sets this.sentDataAccessMetrics', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setProps({
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                isValid: true,
                granules: {
                  hits: 1
                }
              },
              collectionId2: {
                isValid: true,
                granules: {
                  hits: 1
                }
              }
            }
          }
        }
      })

      expect(props.onMetricsDataAccess).toBeCalledTimes(2) // 2 collections
      expect(props.onMetricsDataAccess).toBeCalledWith({ collections: [{ collectionId: 'collectionId1' }], type: 'data_access_init' })
      expect(props.onMetricsDataAccess).toBeCalledWith({ collections: [{ collectionId: 'collectionId2' }], type: 'data_access_init' })

      expect(enzymeWrapper.instance().sentDataAccessMetrics).toBeTruthy()
    })

    test('does not call onMetricsDataAccess if this.sentDataAccessMetrics is true', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().sentDataAccessMetrics = true

      enzymeWrapper.setProps({
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                isValid: true,
                granules: {
                  hits: 1
                }
              },
              collectionId2: {
                isValid: true,
                granules: {
                  hits: 1
                }
              }
            }
          }
        }
      })

      expect(props.onMetricsDataAccess).toBeCalledTimes(0)
    })
  })

  describe('componentWillUnmount', () => {
    test('sets this.sentDataAccessMetrics', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().componentWillUnmount()

      expect(enzymeWrapper.instance().sentDataAccessMetrics).toBeFalsy()
    })
  })
})
