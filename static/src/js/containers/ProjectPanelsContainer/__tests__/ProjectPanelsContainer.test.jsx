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
    portal: {},
    onSelectAccessMethod: jest.fn(),
    onSetActivePanel: jest.fn(),
    onTogglePanels: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onUpdateAccessMethod: jest.fn(),
    onChangeProjectGranulePageNum: jest.fn(),
    onSetActivePanelGroup: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onAddGranuleToProjectCollection: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    location: {
      search: ''
    },
    onChangePath: jest.fn(),
    overrideTemporal: {},
    project: {
      collections: {
        allIds: ['collectionId']
      }
    },
    projectCollectionsMetadata: {
      collectionId: {
        mock: 'data'
      }
    },
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    spatial: {},
    ursProfile: {}
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

  test('onSelectAccessMethod calls actions.selectAccessMethod', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'selectAccessMethod')

    mapDispatchToProps(dispatch).onSelectAccessMethod('method')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('method')
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

  test('onUpdateAccessMethod calls actions.updateAccessMethod', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAccessMethod')

    mapDispatchToProps(dispatch).onUpdateAccessMethod({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onAddGranuleToProjectCollection calls actions.addGranuleToProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addGranuleToProjectCollection')

    mapDispatchToProps(dispatch).onAddGranuleToProjectCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onRemoveGranuleFromProjectCollection calls actions.removeGranuleFromProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeGranuleFromProjectCollection')

    mapDispatchToProps(dispatch).onRemoveGranuleFromProjectCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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

  test('onChangeProjectGranulePageNum calls actions.changeProjectGranulePageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeProjectGranulePageNum')

    mapDispatchToProps(dispatch).onChangeProjectGranulePageNum({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
      project: {},
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
      project: {},
      projectCollectionsMetadata: {},
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
      onAddGranuleToProjectCollection: props.onAddGranuleToProjectCollection,
      onChangePath: props.onChangePath,
      onChangeProjectGranulePageNum: props.onChangeProjectGranulePageNum,
      onFocusedGranuleChange: props.onFocusedGranuleChange,
      onRemoveGranuleFromProjectCollection: props.onRemoveGranuleFromProjectCollection,
      onSelectAccessMethod: props.onSelectAccessMethod,
      onSetActivePanel: props.onSetActivePanel,
      onSetActivePanelGroup: props.onSetActivePanelGroup,
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      onTogglePanels: props.onTogglePanels,
      onUpdateAccessMethod: props.onUpdateAccessMethod,
      onUpdateFocusedCollection: props.onUpdateFocusedCollection,
      onViewCollectionGranules: props.onViewCollectionGranules,
      overrideTemporal: props.overrideTemporal,
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      project: props.project,
      projectCollectionsMetadata: props.projectCollectionsMetadata,
      spatial: {},
      temporal: {},
      ursProfile: {}
    }, {})
  })
})
