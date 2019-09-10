import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SecondaryToolbarContainer } from '../SecondaryToolbarContainer'
import SecondaryToolbar from '../../../components/SecondaryToolbar/SecondaryToolbar'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: '',
    location: {},
    portal: {
      portalId: ''
    },
    projectIds: [],
    savedProject: {},
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn()
  }

  const enzymeWrapper = shallow(<SecondaryToolbarContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SecondaryToolbar).props().authToken).toEqual('')
  })
})
