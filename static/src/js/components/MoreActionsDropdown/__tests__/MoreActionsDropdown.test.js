import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'
import { MoreActionsDropdown } from '../MoreActionsDropdown'

Enzyme.configure({ adapter: new Adapter() })

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

describe('CollectionDetails component', () => {
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
