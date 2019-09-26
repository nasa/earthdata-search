import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectPanelSection from '../ProjectPanelSection'

Enzyme.configure({ adapter: new Adapter() })

describe('ProjectPanelSelection', () => {
  test('displays a heading and children', () => {
    const heading = 'heading'
    const children = (
      <div className="children-div">
        children
      </div>
    )
    const enzymeWrapper = shallow(
      <ProjectPanelSection heading={heading}>
        {children}
      </ProjectPanelSection>
    )

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
    const enzymeWrapper = shallow(
      <ProjectPanelSection heading={heading}>
        {children}
      </ProjectPanelSection>
    )

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
})
