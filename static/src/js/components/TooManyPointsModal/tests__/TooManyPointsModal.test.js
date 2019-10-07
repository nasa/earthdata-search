import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Modal } from 'react-bootstrap'
import * as EventEmitter from '../../../events/events'
import TooManyPointsModal from '../TooManyPointsModal'

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

    expect(enzymeWrapper.find(Modal).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Title).text()).toEqual('Shape file has too many points')
  })

  test('should render instructions', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Body).find('p').at(0).text()).toEqual('To improve search performance, your shapefile has been simplified. Your original shapefile will be used for spatial subsetting if you choose to enable that setting during download.')
  })

  describe('modal actions', () => {
    test('Close button should trigger onToggleTooManyPointsModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.too-many-points-modal__action--secondary').simulate('click')

      expect(props.onToggleTooManyPointsModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleTooManyPointsModal).toHaveBeenCalledWith(false)
    })
  })
})
