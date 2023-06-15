import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { GranuleResultsFocusedMetaContainer } from '../GranuleResultsFocusedMetaContainer'
import GranuleResultsFocusedMeta from '../../../components/GranuleResults/GranuleResultsFocusedMeta'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    earthdataEnvironment: 'prod',
    focusedGranuleMetadata: { test: 'test' },
    focusedGranuleId: '1234-TEST',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsFocusedMetaContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsFocusedMetaContainer component', () => {
  test('passes its props and renders a single GranuleResultsFocusedMeta component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsFocusedMeta).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsFocusedMeta).props().earthdataEnvironment).toEqual('prod')
    expect(enzymeWrapper.find(GranuleResultsFocusedMeta).props().focusedGranuleId).toEqual('1234-TEST')
    expect(enzymeWrapper.find(GranuleResultsFocusedMeta).props().focusedGranuleMetadata).toEqual({ test: 'test' })
  })
})
