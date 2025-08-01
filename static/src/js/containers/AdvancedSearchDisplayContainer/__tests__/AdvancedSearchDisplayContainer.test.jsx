import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdvancedSearchDisplay from '../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay'
import {
  AdvancedSearchDisplayContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdvancedSearchDisplayContainer'

jest.mock('../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdvancedSearchDisplayContainer,
  defaultProps: {
    advancedSearch: {},
    onUpdateAdvancedSearch: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onUpdateAdvancedSearch calls actions.updateAdvancedSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdvancedSearch')

    mapDispatchToProps(dispatch).onUpdateAdvancedSearch({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
    setup()

    expect(AdvancedSearchDisplay).toHaveBeenCalledTimes(1)
    expect(AdvancedSearchDisplay).toHaveBeenCalledWith({
      advancedSearch: {},
      onUpdateAdvancedSearch: expect.any(Function)
    }, {})
  })
})
