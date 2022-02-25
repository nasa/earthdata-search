import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import DeprecatedParameterModal from '../DeprecatedParameterModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: false,
    onToggleDeprecatedParameterModal: jest.fn()
  }

  const enzymeWrapper = shallow(<DeprecatedParameterModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('DeprecatedParameterModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('Oops! It looks like you\'ve used an old web address...')
  })

  test('should render information', () => {
    const { enzymeWrapper } = setup()

    const intro = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[0].props.children
    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[1].props.children

    expect(intro).toContain("Occasionally, we need to make changes to our supported URL parameters. We've updated the URL in your browser, so you don't need to do anything. If you've used a bookmark to navigate here, consider updating the bookmark to use the new URL.")

    expect(message[0]).toEqual('Please visit the ')
    expect(shallow(message[1]).props().children).toEqual('Earthdata Search URL Parameters')
    expect(shallow(message[1]).props().href).toEqual('https://wiki.earthdata.nasa.gov/display/EDSC/Earthdata+Search+URL+Parameters')
    expect(message[2]).toEqual(' wiki page for more information on the supported URL parameters.')
  })
})
