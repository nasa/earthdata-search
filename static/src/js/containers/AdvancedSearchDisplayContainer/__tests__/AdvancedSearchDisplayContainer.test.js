import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import AdvancedSearchDisplay from '../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay'
import { AdvancedSearchDisplayContainer, mapDispatchToProps, mapStateToProps } from '../AdvancedSearchDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    advancedSearch: {},
    onUpdateAdvancedSearch: jest.fn(),
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<AdvancedSearchDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onUpdateAdvancedSearch calls actions.updateAdvancedSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdvancedSearch')

    mapDispatchToProps(dispatch).onUpdateAdvancedSearch({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {}
    }

    const expectedState = {
      advancedSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdvancedSearchDisplayContainer component', () => {
  test('render AdvancedSearchDisplay with the correct props', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(AdvancedSearchDisplay).props())
      .toEqual(props)
  })
})
