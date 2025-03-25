import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminProject } from '../AdminProject'
import { AdminPage } from '../../AdminPage/AdminPage'
import { AdminProjectDetails } from '../../AdminProjectDetails/AdminProjectDetails'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    project: {
      id: 1
    }
  }

  const enzymeWrapper = shallow(<AdminProject {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminProject component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).length).toBe(1)
    expect(enzymeWrapper.find(AdminProjectDetails).length).toBe(1)
  })

  test('renders its components correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminPage).props().pageTitle).toEqual('Project Details')
    expect(enzymeWrapper.find(AdminPage).props().breadcrumbs).toEqual([
      {
        name: 'Admin',
        href: '/admin'
      },
      {
        name: 'Projects',
        href: '/admin/projects'
      },
      {
        name: 'Project Details',
        active: true
      }
    ])

    expect(enzymeWrapper.find(AdminProjectDetails).props().project).toEqual({
      id: 1
    })
  })
})
