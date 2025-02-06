import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import SanitizedHTML from 'react-sanitized-html'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import CollapsePanel from '../../CollapsePanel/CollapsePanel'
import DataQualitySummary from '../DataQualitySummary'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    dataQualitySummaries: [],
    dataQualityHeader: 'Important data quality information',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<DataQualitySummary {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('DataQualitySummary component', () => {
  test('does not render without children', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('renders a sanatized summary', () => {
    const { enzymeWrapper } = setup({
      dataQualitySummaries: [{
        summary: 'I am a summary'
      }]
    })

    expect(enzymeWrapper.find(SanitizedHTML).length).toEqual(1)
    expect(enzymeWrapper.find(SanitizedHTML).prop('allowedTags')).toEqual(['br', 'span', 'a', 'p'])
    expect(enzymeWrapper.find(SanitizedHTML).prop('html')).toEqual('I am a summary')
  })

  test('renders a CollapsePanel', () => {
    const { enzymeWrapper } = setup({
      dataQualitySummaries: [{
        summary: 'I am a summary'
      }]
    })

    expect(enzymeWrapper.find(CollapsePanel).length).toEqual(1)
    expect(enzymeWrapper.find(CollapsePanel).prop('header').props.children[0].type).toEqual(EDSCIcon)
    expect(enzymeWrapper.find(CollapsePanel).prop('header').props.children[1]).toEqual(' Important data quality information')
    expect(enzymeWrapper.find(CollapsePanel).html()).toContain('<div>I am a summary</div>')
  })

  test('renders a duplicate collection notice', () => {
    const { enzymeWrapper } = setup({
      dataQualityHeader: 'Important data availability information',
      dataQualitySummaries: [{
        id: 'duplicate-collection',
        summary: <>I am a duplicate collection notice</>
      }]
    })

    expect(enzymeWrapper.find(CollapsePanel).length).toEqual(1)
    expect(enzymeWrapper.find(CollapsePanel).prop('header').props.children[1]).toEqual(' Important data availability information')
    expect(enzymeWrapper.find(CollapsePanel).html()).toContain('I am a duplicate collection notice')
  })
})
