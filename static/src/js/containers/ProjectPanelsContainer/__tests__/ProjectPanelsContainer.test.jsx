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
    focusedGranuleId: '',
    granulesMetadata: {},
    onSetActivePanel: jest.fn(),
    onTogglePanels: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onSetActivePanelGroup: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    location: {
      search: ''
    },
    onChangePath: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    ursProfile: {}
  },
  defaultZustandState: {
    dataQualitySummaries: {
      byCollectionId: {},
      setDataQualitySummaries: jest.fn()
    },
    focusedCollection: {
      focusedCollection: 'collectionId',
      setFocusedCollection: jest.fn()
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
      }
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels('data')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('data')
  })

  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('panelId')
  })

  test('onSetActivePanelGroup calls actions.setActivePanelGroup', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelGroup')

    mapDispatchToProps(dispatch).onSetActivePanelGroup('panelId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('panelId')
  })

  test('onFocusedGranuleChange calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onFocusedGranuleChange('granuleId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('granuleId')
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
      metadata: {
        collections: {},
        granules: {}
      },
      focusedGranule: 'granuleId',
      map: {},
      panels: {},
      router: {
        location: {}
      },
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      focusedGranuleId: 'granuleId',
      granulesMetadata: {},
      location: {},
      panels: {},
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
      focusedCollectionId: 'collectionId',
      focusedGranuleId: props.focusedGranuleId,
      granulesMetadata: props.granulesMetadata,
      granulesQueries: {},
      location: props.location,
      onAddGranuleToProjectCollection: zustandState.project.addGranuleToProjectCollection,
      onChangePath: props.onChangePath,
      onFocusedGranuleChange: props.onFocusedGranuleChange,
      onRemoveGranuleFromProjectCollection: zustandState.project.removeGranuleFromProjectCollection,
      onSelectAccessMethod: zustandState.project.selectAccessMethod,
      onSetActivePanel: props.onSetActivePanel,
      onSetActivePanelGroup: props.onSetActivePanelGroup,
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      onTogglePanels: props.onTogglePanels,
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
      setFocusedCollection: zustandState.focusedCollection.setFocusedCollection,
      spatial: {
        boundingBox: [],
        circle: [],
        line: [],
        point: [],
        polygon: []
      },
      temporal: {},
      ursProfile: {}
    }, {})
  })
})
