import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Dropdown } from 'react-bootstrap'
import { FaBacon } from 'react-icons/fa'

import { RadioSettingDropdown } from '../RadioSettingDropdown'

Enzyme.configure({ adapter: new Adapter() })

const itemOnClickCallbackMock = jest.fn()

let windowEventMap = {}

beforeEach(() => {
  jest.clearAllMocks()
  const rootNode = document.createElement('div')
  rootNode.id = 'root'
  document.body.appendChild(rootNode)

  windowEventMap = {}
  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
})

afterEach(() => {
  const rootNode = document.getElementById('root')
  document.body.removeChild(rootNode)
})

function setup(overrideProps) {
  const props = {
    id: 'radio-setting-dropdown',
    children: null,
    className: null,
    handoffLinks: [],
    activeIcon: FaBacon,
    label: 'Label',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<RadioSettingDropdown {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('RadioSettingDropdown component', () => {
  test('renders nothing when no settings are provided', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeNull()
    expect(enzymeWrapper.type()).toBeNull()
  })

  test('renders correctly when items links are provided', () => {
    const { enzymeWrapper } = setup({
      id: 'test-id',
      label: 'menu label',
      settings: [
        {
          label: 'setting label',
          isActive: false,
          onClick: itemOnClickCallbackMock
        }
      ]
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
  })

  test('adds a key to the Dropdown component to force rerenders', () => {
    const { enzymeWrapper } = setup({
      id: 'test-id',
      label: 'menu label',
      settings: [
        {
          label: 'setting label',
          isActive: false,
          onClick: itemOnClickCallbackMock
        }
      ]
    })

    expect(enzymeWrapper.find(Dropdown).key()).toEqual('0_menu_label')
  })
})
