import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, ProjectPanelsContainer } from '../ProjectPanelsContainer'
import ProjectPanels from '../../../components/ProjectPanels/ProjectPanels'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    dataQualitySummaries: {},
    focusedCollectionId: '',
    focusedGranuleId: '',
    granuleQuery: {},
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
    spatial: {}
  }

  const enzymeWrapper = shallow(<ProjectPanelsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })

  test('onSelectAccessMethod calls actions.selectAccessMethod', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'selectAccessMethod')

    mapDispatchToProps(dispatch).onSelectAccessMethod('method')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('method')
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels('data')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('data')
  })

  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onSetActivePanelGroup calls actions.setActivePanelGroup', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelGroup')

    mapDispatchToProps(dispatch).onSetActivePanelGroup('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onUpdateAccessMethod calls actions.updateAccessMethod', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAccessMethod')

    mapDispatchToProps(dispatch).onUpdateAccessMethod({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFetchDataQualitySummaries calls actions.fetchDataQualitySummaries', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchDataQualitySummaries')

    mapDispatchToProps(dispatch).onFetchDataQualitySummaries('conceptId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('conceptId')
  })

  test('onAddGranuleToProjectCollection calls actions.addGranuleToProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addGranuleToProjectCollection')

    mapDispatchToProps(dispatch).onAddGranuleToProjectCollection({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onRemoveGranuleFromProjectCollection calls actions.removeGranuleFromProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeGranuleFromProjectCollection')

    mapDispatchToProps(dispatch).onRemoveGranuleFromProjectCollection({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onFocusedGranuleChange calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onFocusedGranuleChange('granuleId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('granuleId')
  })

  test('onChangeProjectGranulePageNum calls actions.changeProjectGranulePageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeProjectGranulePageNum')

    mapDispatchToProps(dispatch).onChangeProjectGranulePageNum({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onViewCollectionGranules calls actions.viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onToggleAboutCSDAModal calls actions.viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      dataQualitySummaries: {},
      metadata: {
        collections: {},
        granules: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      map: {},
      panels: {},
      portal: {},
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
      shapefile: {
        shapefileId: ''
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
      portal: {},
      project: {},
      projectCollectionsMetadata: {},
      shapefileId: '',
      spatial: {},
      temporal: {},
      overrideTemporal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectPanelsContainer component', () => {
  test('passes its props and renders a single ProjectPanels component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectPanels).length).toBe(1)
    expect(enzymeWrapper.find(ProjectPanels).props().projectCollectionsMetadata).toEqual({
      collectionId: {
        mock: 'data'
      }
    })
    expect(enzymeWrapper.find(ProjectPanels).props().project).toEqual({
      collections: {
        allIds: ['collectionId']
      }
    })
    expect(typeof enzymeWrapper.find(ProjectPanels).props().onSetActivePanel).toEqual('function')
    expect(typeof enzymeWrapper.find(ProjectPanels).props().onTogglePanels).toEqual('function')
    expect(enzymeWrapper.find(ProjectPanels).props().panels).toEqual({
      activePanel: '0.0.0',
      isOpen: false
    })
  })
})
