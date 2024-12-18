import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaCocktail } from 'react-icons/fa'
import { OverlayTrigger } from 'react-bootstrap'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import MetaIcon from '../MetaIcon'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    icon: FaCocktail,
    id: 'icon',
    label: 'MetaIcon Label',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<MetaIcon {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('MetaIcon component', () => {
  test('should render the component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.meta-icon').length).toEqual(1)
  })

  test('should render the EDSCIcon', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCIcon).length).toEqual(1)
  })

  test('should render the label', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.meta-icon__label').length).toEqual(1)
    expect(enzymeWrapper.find('.meta-icon__label').text()).toEqual('MetaIcon Label')
  })

  test('should not render metadata by default', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.meta-icon__metadata').length).toEqual(0)
  })

  describe('when setting a tooltip', () => {
    test('should render the tooltip', () => {
      const { enzymeWrapper } = setup({
        tooltipContent: 'Test tooltip content'
      })

      expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
      const tooltip = shallow(enzymeWrapper.find(OverlayTrigger).props().overlay)
      expect(tooltip.text()).toEqual('Test tooltip content')
    })

    describe('when setting no placement is provided', () => {
      test('should set the default placement to top', () => {
        const { enzymeWrapper } = setup({
          tooltipContent: 'Test tooltip content'
        })

        expect(enzymeWrapper.find(OverlayTrigger).props().placement).toEqual('top')
      })
    })

    describe('when setting a custom placement', () => {
      test('should set the custom placement', () => {
        const { enzymeWrapper } = setup({
          tooltipContent: 'Test tooltip content',
          placement: 'right'
        })

        expect(enzymeWrapper.find(OverlayTrigger).props().placement).toEqual('right')
      })
    })

    describe('when provided a custom tooltip class name', () => {
      test('adds the class name', () => {
        const { enzymeWrapper } = setup({
          tooltipContent: 'Test tooltip content',
          tooltipClassName: 'test-class-name'
        })

        expect(enzymeWrapper.find(OverlayTrigger).length).toEqual(1)
        const tooltip = shallow(enzymeWrapper.find(OverlayTrigger).props().overlay)
        expect(tooltip.props().className).toContain('test-class-name')
      })
    })
  })

  describe('when provided iconProps', () => {
    test('should set the icon props', () => {
      const { enzymeWrapper } = setup({
        iconProps: {
          size: '20rem'
        }
      })

      expect(enzymeWrapper.find(EDSCIcon).props().size).toEqual('20rem')
    })
  })

  describe('when metadata is provided', () => {
    test('should show the metadata', () => {
      const { enzymeWrapper } = setup({
        metadata: 'test-metadata'
      })

      expect(enzymeWrapper.find('.meta-icon__metadata').text()).toEqual('test-metadata')
    })
  })
})
