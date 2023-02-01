import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, TemporalSelectionDropdownContainer } from '../TemporalSelectionDropdownContainer'
import TemporalSelectionDropdown from '../../../components/TemporalDisplay/TemporalSelectionDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporalSearch: {},
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<TemporalSelectionDropdownContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
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
      query: {
        collection: {
          temporal: {}
        }
      }
    }

    const expectedState = {
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('TemporalSelectionDropdownContainer component', () => {
  test('passes its props and renders a single TemporalSelectionDropdown component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(TemporalSelectionDropdown).length).toBe(1)
    expect(enzymeWrapper.find(TemporalSelectionDropdown).props().temporalSearch).toEqual({})
    expect(typeof enzymeWrapper.find(TemporalSelectionDropdown).props().onChangeQuery).toEqual('function')
  })
})
