import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectPanelSection from '../ProjectPanelSection'

Enzyme.configure({ adapter: new Adapter() })

const setup = (overrideProps) => {
  const props = {
    ...overrideProps
  }

  return {
    enzymeWrapper: shallow(<ProjectPanelSection {...props} />),
    props
  }
}

describe('ProjectPanelSelection', () => {
  test('displays a heading and children', () => {
    const heading = 'heading'
    const children = (
      <div className="children-div">
        children
      </div>
    )

    const { enzymeWrapper } = setup({
      heading,
      children
    })

    expect(enzymeWrapper.find('h3.project-panel-section__heading').text()).toEqual('heading')
    expect(enzymeWrapper.find('div.children-div').text()).toEqual('children')
  })

  test('does not display heading if it is not provided', () => {
    const heading = undefined
    const children = (
      <div className="children-div">
        children
      </div>
    )

    const { enzymeWrapper } = setup({
      heading,
      children
    })

    expect(enzymeWrapper.find('h3.project-panel-section__heading').exists()).toBeFalsy()
    expect(enzymeWrapper.find('div.children-div').text()).toEqual('children')
  })

  test('does not display children if it is not provided', () => {
    const heading = 'heading'
    const enzymeWrapper = shallow(
      <ProjectPanelSection heading={heading} />
    )

    expect(enzymeWrapper.find('h3.project-panel-section__heading').text()).toEqual('heading')
    expect(enzymeWrapper.find('div.project-panel-section').children().length).toBe(1)
  })

  describe('when the project panel is nested', () => {
    const heading = 'heading'
    const children = (
      <div className="children-div">
        children
      </div>
    )
    const nested = true

    const { enzymeWrapper } = setup({
      heading,
      children,
      nested
    })

    test('adds the modifier class', () => {
      expect(enzymeWrapper.props().className).toContain('project-panel-section--is-nested')
    })
  })

  describe('when the project panel is a step', () => {
    const heading = 'heading'
    const children = (
      <div className="children-div">
        children
      </div>
    )
    const step = 1

    const { enzymeWrapper } = setup({
      heading,
      children,
      step
    })

    test('displays a step indicator', () => {
      expect(enzymeWrapper.find('.project-panel-section__step').text()).toEqual('1')
    })

    test('adds the modifier class', () => {
      expect(enzymeWrapper.props().className).toContain('project-panel-section--is-step')
    })
  })

  describe('when a custom heading level is used', () => {
    const heading = 'heading'
    const children = (
      <div className="children-div">
        children
      </div>
    )
    const headingLevel = 'h4'

    const { enzymeWrapper } = setup({
      heading,
      children,
      headingLevel
    })

    test('displays a custom heading level', () => {
      expect(enzymeWrapper.find('h4').text()).toEqual(heading)
    })
  })

  describe('when intro text is provided', () => {
    test('displays the intro text', () => {
      const heading = 'heading'
      const children = (
        <div className="children-div">
          children
        </div>
      )
      const intro = 'some intro text'

      const { enzymeWrapper } = setup({
        heading,
        children,
        intro
      })

      expect(enzymeWrapper.find('.project-panel-section__intro').text()).toEqual(intro)
    })
  })
})
