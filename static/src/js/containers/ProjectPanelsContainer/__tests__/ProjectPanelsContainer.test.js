import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ProjectPanelsContainer } from '../ProjectPanelsContainer'
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
    onUpdateAccessMethod: jest.fn(),
    onChangeProjectGranulePageNum: jest.fn(),
    onSetActivePanelGroup: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onAddGranuleToProjectCollection: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
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
