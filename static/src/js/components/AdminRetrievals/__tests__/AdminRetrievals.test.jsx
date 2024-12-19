import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminRetrievals } from '../AdminRetrievals'
import { AdminPage } from '../../AdminPage/AdminPage'
import { AdminRetrievalsList } from '../AdminRetrievalsList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    historyPush: jest.fn(),
    onAdminViewRetrieval: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {
      allIds: [],
      byId: {},
      pagination: {},
      sortKey: ''
    }
  }

  const enzymeWrapper = shallow(<AdminRetrievals {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).length).toBe(1)
    expect(enzymeWrapper.find(AdminRetrievalsList).length).toBe(1)
  })
})
