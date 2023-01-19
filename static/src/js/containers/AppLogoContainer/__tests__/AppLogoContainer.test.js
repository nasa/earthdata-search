import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { mapStateToProps, AppLogoContainer } from '../AppLogoContainer'
import AppLogo from '../../../components/AppLogo/AppLogo'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    portal: {},
    match: {}
  }

  const enzymeWrapper = shallow(<AppLogoContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AppLogoContainer component', () => {
  test('passes its props and renders a single AppLogo component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AppLogo).length).toBe(1)
    expect(enzymeWrapper.find(AppLogo).props().match).toEqual({})
    expect(enzymeWrapper.find(AppLogo).props().portal).toEqual({})
  })
})
