import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

// TODO this page is not done but, it night not be used
import { AdminMetrics } from '../AdminMetrics'
import { AdminPage } from '../../AdminPage/AdminPage'
import { AdminRetrievalDetails } from '../../AdminRetrievalDetails/AdminRetrievalDetails'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    retrieval: {
      id: 1
    },
    onRequeueOrder: jest.fn()
  }

  const enzymeWrapper = shallow(<AdminMetrics {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrieval component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).length).toBe(1)
    expect(enzymeWrapper.find(AdminRetrievalDetails).length).toBe(1)
  })

  test('renders its components correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).props().pageTitle).toEqual('Retrieval Details')
    expect(enzymeWrapper.find(AdminPage).props().breadcrumbs).toEqual([
      {
        name: 'Admin',
        href: '/admin'
      },
      {
        name: 'Retrievals',
        href: '/admin/retrievals'
      },
      {
        name: 'Retrieval Details',
        active: true
      }
    ])

    expect(enzymeWrapper.find(AdminRetrievalDetails).props().retrieval).toEqual({
      id: 1
    })
  })
})
