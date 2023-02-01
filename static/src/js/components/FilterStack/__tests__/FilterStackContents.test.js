import React from 'react'
import PropTypes from 'prop-types'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FilterStackContents from '../FilterStackContents'

Enzyme.configure({ adapter: new Adapter() })

const TestChild = (props) => {
  const { title } = props
  return (
    <div key={title} className="test-classname">
      Child
    </div>
  )
}

TestChild.propTypes = {
  title: PropTypes.string.isRequired
}

function setup() {
  const props = {
    body: null,
    title: null
  }

  const enzymeWrapper = shallow(<FilterStackContents {...props} />)
  const childWrapper = shallow(<TestChild title="Test" />)

  return {
    childWrapper,
    enzymeWrapper,
    props
  }
}

describe('FilterStackContents component', () => {
  test('does not render without a body prop', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ title: 'Test' })

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('does not render without a title prop', () => {
    const { enzymeWrapper, childWrapper } = setup()
    enzymeWrapper.setProps({ body: childWrapper.get(0) })

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('renders itself correctly correct props', () => {
    const { enzymeWrapper, childWrapper } = setup()
    enzymeWrapper.setProps({
      body: childWrapper.get(0),
      title: 'Test'
    })

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.hasClass('filter-stack-contents')).toBe(true)
  })

  test('renders child correctly correct props', () => {
    const { enzymeWrapper, childWrapper } = setup()
    enzymeWrapper.setProps({
      body: childWrapper.get(0),
      title: 'Test'
    })

    expect(
      enzymeWrapper.containsMatchingElement(
        <div className="test-classname">
          Child
        </div>
      )
    ).toBe(true)
  })
})
