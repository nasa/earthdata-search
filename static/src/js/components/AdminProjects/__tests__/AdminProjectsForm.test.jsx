import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import Form from 'react-bootstrap/Form'

import AdminProjectsForm from '../AdminProjectsForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onAdminViewProject: jest.fn()
  }

  const enzymeWrapper = shallow(<AdminProjectsForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminProjects component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Form).length).toBe(1)
  })
})
