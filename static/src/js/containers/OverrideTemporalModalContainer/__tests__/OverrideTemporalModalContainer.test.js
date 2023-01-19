import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, OverrideTemporalModalContainer } from '../OverrideTemporalModalContainer'
import OverrideTemporalModal
  from '../../../components/OverrideTemporalModal/OverrideTemporalModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    temporalSearch: {},
    timeline: {},
    onChangeProjectQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  }

  const enzymeWrapper = shallow(<OverrideTemporalModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeProjectQuery calls actions.changeProjectQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeProjectQuery')

    mapDispatchToProps(dispatch).onChangeProjectQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleOverrideTemporalModal calls actions.toggleOverrideTemporalModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleOverrideTemporalModal')

    mapDispatchToProps(dispatch).onToggleOverrideTemporalModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {
          temporal: {}
        }
      },
      timeline: {},
      ui: {
        overrideTemporalModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false,
      temporalSearch: {},
      timeline: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('OverrideTemporalModalContainer component', () => {
  test('passes its props and renders a single OverrideTemporalModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(OverrideTemporalModal).length).toBe(1)
    expect(enzymeWrapper.find(OverrideTemporalModal).props().isOpen).toEqual(true)
    expect(enzymeWrapper.find(OverrideTemporalModal).props().temporalSearch).toEqual({})
    expect(enzymeWrapper.find(OverrideTemporalModal).props().timeline).toEqual({})
    expect(typeof enzymeWrapper.find(OverrideTemporalModal)
      .props().onChangeQuery).toEqual('function')
    expect(typeof enzymeWrapper.find(OverrideTemporalModal)
      .props().onToggleOverrideTemporalModal).toEqual('function')
  })
})
