import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import TooManyPointsModal from '../TooManyPointsModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onToggleTooManyPointsModal: jest.fn(),
    isOpen: false
  }

  const enzymeWrapper = shallow(<TooManyPointsModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TooManyPointsModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('Shape file has too many points')
  })

  test('should render a message', () => {
    const { enzymeWrapper } = setup()

    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children

    expect(message).toEqual('To improve search performance, your shapefile has been simplified. Your original shapefile will be used for spatial subsetting if you choose to enable that setting during download.')
  })

  describe('modal actions', () => {
    test('Close button should trigger onToggleTooManyPointsModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModalContainer).prop('onClose')()

      expect(props.onToggleTooManyPointsModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleTooManyPointsModal).toHaveBeenCalledWith(false)
    })
  })
})
