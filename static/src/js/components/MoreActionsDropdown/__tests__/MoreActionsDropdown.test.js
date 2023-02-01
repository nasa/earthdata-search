import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Dropdown } from 'react-bootstrap'
import { MoreActionsDropdown } from '../MoreActionsDropdown'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  const rootNode = document.createElement('div')
  rootNode.id = 'root'
  document.body.appendChild(rootNode)
})

afterEach(() => {
  const rootNode = document.getElementById('root')
  document.body.removeChild(rootNode)
})

function setup(overrideProps) {
  const props = {
    children: null,
    className: null,
    handoffLinks: [],
    ...overrideProps
  }

  const enzymeWrapper = shallow(<MoreActionsDropdown {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('MoreActionsDropdown component', () => {
  test('renders nothing when no data is provided', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeNull()
    expect(enzymeWrapper.type()).toBeNull()
  })

  test('renders correctly when handoff links are provided', () => {
    const { enzymeWrapper } = setup({
      handoffLinks: [{
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
      }]
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(1)
  })

  test('renders correctly when children are provided', () => {
    const { enzymeWrapper } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(1)
  })

  test('renders correctly when children and handoff links are provided', () => {
    const { enzymeWrapper } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>,
      handoffLinks: [{
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
      }]
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(2)
  })
})
