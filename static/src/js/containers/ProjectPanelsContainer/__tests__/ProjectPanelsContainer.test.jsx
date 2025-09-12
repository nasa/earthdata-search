import React from 'react'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  ProjectPanelsContainer
} from '../ProjectPanelsContainer'
import ProjectPanels from '../../../components/ProjectPanels/ProjectPanels'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/ProjectPanels/ProjectPanels', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectPanelsContainer,
  defaultProps: {
    onToggleAboutCSDAModal: jest.fn(),
    onChangePath: jest.fn(),
    ursProfile: {}
  },
  defaultZustandState: {
    dataQualitySummaries: {
      byCollectionId: {},
      setDataQualitySummaries: jest.fn()
    },
    collection: {
      collectionId: 'collectionId',
      setCollectionId: jest.fn()
    },
    project: {
      addGranuleToProjectCollection: jest.fn(),
      collections: {
        allIds: ['collectionId']
      },
      removeGranuleFromProjectCollection: jest.fn(),
      selectAccessMethod: jest.fn(),
      updateAccessMethod: jest.fn()
    },
    query: {
      collections: {
        byId: {
          collectionId: {
            granules: {}
          }
        }
      },
      dataQualitySummaries: {
        byCollectionId: {},
        setDataQualitySummaries: jest.fn()
      }
    },
    projectPanels: {
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      setActivePanel: jest.fn(),
      setIsOpen: jest.fn(),
      setPanelGroup: jest.fn()
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('onToggleAboutCSDAModal calls actions.toggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      contactInfo: {
        ursProfile: {}
      },
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectPanelsContainer component', () => {
  test('passes its props and renders a single ProjectPanels component', () => {
    const { props, zustandState } = setup()

    expect(ProjectPanels).toHaveBeenCalledTimes(1)
    expect(ProjectPanels).toHaveBeenCalledWith({
      dataQualitySummaries: {},
      collectionId: 'collectionId',
      granulesQueries: {},
      location: {
        hash: '',
        key: 'default',
        pathname: '/',
        search: '',
        state: null
      },
      onAddGranuleToProjectCollection: zustandState.project.addGranuleToProjectCollection,
      onChangePath: props.onChangePath,
      onRemoveGranuleFromProjectCollection: zustandState.project.removeGranuleFromProjectCollection,
      onSelectAccessMethod: zustandState.project.selectAccessMethod,
      onSetActivePanel: expect.any(Function),
      onSetActivePanelGroup: expect.any(Function),
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      onTogglePanels: expect.any(Function),
      onUpdateAccessMethod: zustandState.project.updateAccessMethod,
      overrideTemporal: {},
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      projectCollections: {
        allIds: ['collectionId'],
        byId: {}
      },
      projectCollectionsMetadata: {},
      setCollectionId: zustandState.collection.setCollectionId,
      spatial: {},
      temporal: {},
      ursProfile: {}
    }, {})
  })
})
