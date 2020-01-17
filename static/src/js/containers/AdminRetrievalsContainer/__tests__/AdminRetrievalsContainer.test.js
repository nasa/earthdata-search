
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import { AdminRetrievalsContainer } from '../AdminRetrievalsContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    history: {
      push: jest.fn()
    },
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {}
  }

  const enzymeWrapper = shallow(<AdminRetrievalsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrievalsContainer component', () => {
  test('render AdminRetrievals with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminRetrievals).length).toBe(1)
  })
})
