import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { SidebarContainer } from '../SidebarContainer'
import Sidebar from '../../../components/Sidebar/Sidebar'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    headerChildren: 'headerChildren',
    panels: 'panels',
    children: 'children',
    location: {
      pathname: '/search'
    }
  }

  const enzymeWrapper = shallow(<SidebarContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SidebarContainer component', () => {
  test('passes its props and renders a single Sidebar component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Sidebar).length).toBe(1)
    expect(enzymeWrapper.find(Sidebar).props().panels).toEqual('panels')
    expect(enzymeWrapper.find(Sidebar).props().visible).toEqual(true)
    expect(enzymeWrapper.find(Sidebar).props().headerChildren).toEqual('headerChildren')
    expect(enzymeWrapper.find(Sidebar).props().children).toEqual('children')
  })
})
