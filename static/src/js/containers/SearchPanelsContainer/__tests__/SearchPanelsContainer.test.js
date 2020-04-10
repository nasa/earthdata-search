import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchPanelsContainer } from '../SearchPanelsContainer'
import SearchPanels from '../../../components/SearchPanels/SearchPanels'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    portal: {
      test: 'portal'
    },
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    }
  }

  const enzymeWrapper = shallow(<SearchPanelsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchPanelsContainer fcomponent', () => {
  test('passes its props and renders a single SearchPanels component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SearchPanels).length).toBe(1)
    expect(typeof enzymeWrapper.find(SearchPanels).props().onSetActivePanel).toEqual('function')
    expect(typeof enzymeWrapper.find(SearchPanels).props().onTogglePanels).toEqual('function')
    expect(enzymeWrapper.find(SearchPanels).props().panels).toEqual({
      activePanel: '0.0.0',
      isOpen: false
    })
    expect(enzymeWrapper.find(SearchPanels).props().portal).toEqual({
      test: 'portal'
    })
  })
})
