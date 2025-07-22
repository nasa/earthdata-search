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
    focusedCollectionId: 'collectionId',
    focusedGranuleId: '',
    granulesMetadata: {},
    onToggleAboutCSDAModal: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
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

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onFocusedGranuleChange calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onFocusedGranuleChange('granuleId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('granuleId')
  })

  test('onViewCollectionGranules calls actions.viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
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
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      map: {},
      panels: {},
      query: {
        collection: {
          spatial: {},
          temporal: {},
          overrideTemporal: {}
        }
      },
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
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      granulesMetadata: {},
      location: {},
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectPanelsContainer component', () => {
  test('passes its props and renders a single ProjectPanels component', () => {
    const { props } = setup()

    expect(ProjectPanels).toHaveBeenCalledTimes(1)
    expect(ProjectPanels).toHaveBeenCalledWith({
      dataQualitySummaries: {},
      focusedCollectionId: props.focusedCollectionId,
      focusedGranuleId: props.focusedGranuleId,
      granulesMetadata: props.granulesMetadata,
      granulesQueries: {},
      location: props.location,
      onAddGranuleToProjectCollection: expect.any(Function),
      onChangePath: props.onChangePath,
      onFocusedGranuleChange: props.onFocusedGranuleChange,
      onRemoveGranuleFromProjectCollection: expect.any(Function),
      onSelectAccessMethod: expect.any(Function),
      onSetActivePanel: expect.any(Function),
      onSetActivePanelGroup: expect.any(Function),
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      onTogglePanels: expect.any(Function),
      onUpdateAccessMethod: expect.any(Function),
      onUpdateFocusedCollection: props.onUpdateFocusedCollection,
      onViewCollectionGranules: props.onViewCollectionGranules,
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
