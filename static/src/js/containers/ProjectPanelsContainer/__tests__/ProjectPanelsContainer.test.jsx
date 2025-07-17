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
    dataQualitySummaries: {},
    focusedCollectionId: '',
    focusedGranuleId: '',
    granulesQueries: {},
    granulesMetadata: {},
    onSetActivePanel: jest.fn(),
    onTogglePanels: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onSetActivePanelGroup: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    location: {
      search: ''
    },
    onChangePath: jest.fn(),
    overrideTemporal: {},
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    spatial: {},
    ursProfile: {}
  },
  defaultZustandState: {
    project: {
      collections: {
        allIds: ['collectionId']
      },
      addGranuleToProjectCollection: jest.fn(),
      removeGranuleFromProjectCollection: jest.fn(),
      selectAccessMethod: jest.fn(),
      updateAccessMethod: jest.fn()
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
      dataQualitySummaries: {},
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
      dataQualitySummaries: {},
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      granulesMetadata: {},
      location: {},
      panels: {},
      spatial: {},
      temporal: {},
      ursProfile: {},
      overrideTemporal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectPanelsContainer component', () => {
  test('passes its props and renders a single ProjectPanels component', () => {
    const { props } = setup()

    expect(ProjectPanels).toHaveBeenCalledTimes(1)
    expect(ProjectPanels).toHaveBeenCalledWith({
      dataQualitySummaries: props.dataQualitySummaries,
      focusedCollectionId: props.focusedCollectionId,
      focusedGranuleId: props.focusedGranuleId,
      granulesQueries: props.granulesQueries,
      granulesMetadata: props.granulesMetadata,
      location: props.location,
      onAddGranuleToProjectCollection: expect.any(Function),
      onChangePath: props.onChangePath,
      onFocusedGranuleChange: props.onFocusedGranuleChange,
      onRemoveGranuleFromProjectCollection: expect.any(Function),
      onSelectAccessMethod: expect.any(Function),
      onSetActivePanel: props.onSetActivePanel,
      onSetActivePanelGroup: props.onSetActivePanelGroup,
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      onTogglePanels: props.onTogglePanels,
      onUpdateAccessMethod: expect.any(Function),
      onUpdateFocusedCollection: props.onUpdateFocusedCollection,
      onViewCollectionGranules: props.onViewCollectionGranules,
      overrideTemporal: props.overrideTemporal,
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      project: expect.objectContaining({
        collections: {
          allIds: ['collectionId'],
          byId: {}
        }
      }),
      projectCollectionsMetadata: {},
      spatial: {},
      temporal: {},
      ursProfile: {}
    }, {})
  })
})
