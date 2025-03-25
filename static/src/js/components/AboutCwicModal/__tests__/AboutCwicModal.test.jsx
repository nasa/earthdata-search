import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import AboutCwicModal from '../AboutCwicModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: false,
    onToggleAboutCwicModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AboutCwicModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AboutCwicModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('What\'s Int\'l / Interagency Data')
  })

  test('should render instructions', () => {
    const { enzymeWrapper } = setup()

    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[0].props.children.join('')

    expect(message).toContain('This collection uses external services to find granules through a system called CWIC.')
  })
})
