import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment'

import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown'

import TemporalSelection from '../../TemporalSelection/TemporalSelection'
import Datepicker from '../../Datepicker/Datepicker'
import TemporalSelectionDropdown from '../TemporalSelectionDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporalSearch: {},
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<TemporalSelectionDropdown {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalSelectionDropdown component', () => {
  test('on load should be closed on inital render', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(false)
  })

  test('when clicked toggles the state of show ', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(Dropdown.Toggle).simulate('click')
    expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(true)
  })

  test('clears the values onClearClick', () => {
    const { enzymeWrapper } = setup()
    const onChangeQueryMock = jest.fn()
    enzymeWrapper.setProps({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })
    enzymeWrapper.setState({ open: true })

    enzymeWrapper.instance().onClearClick()

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: ''
      }
    })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({
      disabled: false,
      open: false,
      temporal: {
        startDate: '',
        endDate: ''
      }
    })
  })

  test('applies the values onApplyClick', () => {
    const { enzymeWrapper } = setup()
    const onChangeQueryMock = jest.fn()
    enzymeWrapper.setProps({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {}
    })
    enzymeWrapper.setState({
      open: true,
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    enzymeWrapper.instance().onApplyClick()

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: {
          endDate: '2019-03-30T00:00:00.000Z',
          startDate: '2019-03-29T00:00:00.000Z'
        }
      }
    })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({
      open: false,
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      },
      disabled: false
    })
  })
})
