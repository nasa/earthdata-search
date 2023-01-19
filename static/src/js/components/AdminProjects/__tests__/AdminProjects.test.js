import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminProjects } from '../AdminProjects'
import { AdminPage } from '../../AdminPage/AdminPage'
import { AdminProjectsList } from '../AdminProjectsList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    historyPush: jest.fn(),
    onAdminViewProject: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    retrievals: {
      allIds: [],
      byId: {},
      pagination: {},
      sortKey: ''
    }
  }

  const enzymeWrapper = shallow(<AdminProjects {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminProjects component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).length).toBe(1)
    expect(enzymeWrapper.find(AdminProjectsList).length).toBe(1)
  })
})
