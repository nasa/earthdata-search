import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Downloads from '../Downloads'

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
    }
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
})
