import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Downloads from '../Downloads'
import Header from '../../../components/Sidebar/SidebarHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onChangePath: jest.fn(),
    retrieval: {
      jsondata: {
        source: '?some=testparams'
      }
    },
    match: {
      params: {
        id: 1
      },
      path: '/downloads/1'
    },
    portal: {}
  }

  const enzymeWrapper = shallow(<Downloads.WrappedComponent {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Downloads component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('displays a header', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Header).length).toBe(1)
  })
})
