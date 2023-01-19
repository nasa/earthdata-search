import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import DeprecatedParameterModal from '../DeprecatedParameterModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    deprecatedUrlParams: ['test'],
    isOpen: false,
    onToggleDeprecatedParameterModal: jest.fn(),
    ...overrideProps
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
    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[2].props.children

    expect(intro).toContain('Occasionally, we need to make changes to our supported URL parameters.')

    expect(message[0]).toEqual('Please visit the ')
    expect(shallow(message[1]).props().children).toEqual('Earthdata Search URL Parameters')
    expect(shallow(message[1]).props().href).toEqual('https://wiki.earthdata.nasa.gov/display/EDSC/Earthdata+Search+URL+Parameters')
    expect(message[2]).toEqual(' wiki page for more information on the supported URL parameters.')
  })

  describe('displays the deprecated parameters section', () => {
    test('when only one param is provided', () => {
      const { enzymeWrapper } = setup()

      let deprecatedParamSection = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[1]
      deprecatedParamSection = shallow(deprecatedParamSection)

      expect(deprecatedParamSection.text()).toEqual('The following URL parameter has been deprecated: test')
    })

    test('when two params is provided', () => {
      const { enzymeWrapper } = setup({
        deprecatedUrlParams: ['test', 'another test']
      })

      let deprecatedParamSection = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[1]
      deprecatedParamSection = shallow(deprecatedParamSection)

      expect(deprecatedParamSection.text()).toEqual('The following URL parameters have been deprecated: test and another test')
    })

    test('when three or more params are provided', () => {
      const { enzymeWrapper } = setup({
        deprecatedUrlParams: ['test', 'another test', 'another another test']
      })

      let deprecatedParamSection = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[1]
      deprecatedParamSection = shallow(deprecatedParamSection)

      expect(deprecatedParamSection.text()).toEqual('The following URL parameters have been deprecated: test, another test and another another test')
    })
  })
})
