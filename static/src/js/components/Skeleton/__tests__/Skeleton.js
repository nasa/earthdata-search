import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Skeleton from '../Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(options) {
  let testSkeleton

  if (!options || options.singleShape) {
    testSkeleton = [
      {
        shape: 'rectangle',
        left: 10,
        top: 12,
        height: 12,
        width: 200,
        radius: 3
      }
    ]
  } else if (options.multiShape) {
    testSkeleton = [
      {
        shape: 'rectangle',
        left: 10,
        top: 12,
        height: 12,
        width: 200,
        radius: 3
      },
      {
        shape: 'rectangle',
        left: 30,
        top: 12,
        height: 12,
        width: 100,
        radius: 3
      }
    ]
  } else if (options.unknownShape) {
    testSkeleton = [
      {
        shape: 'unknown',
        left: 10,
        top: 12,
        height: 12,
        width: 200,
        radius: 3
      }
    ]
  }

  const testStyles = {
    background: 'red',
    border: '1px solid green'
  }

  const props = {
    className: 'test-class',
    containerStyle: testStyles,
    shapes: testSkeleton
  }

  const enzymeWrapper = shallow(<Skeleton {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Skeleton component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.hasClass('skeleton')).toBe(true)
    expect(enzymeWrapper.hasClass('test-class')).toBe(true)
  })

  test('renders the inner div correctly', () => {
    const { enzymeWrapper } = setup()
    const innerDiv = enzymeWrapper.find('.skeleton__inner')

    expect(innerDiv.length).toBe(1)
    expect(innerDiv.hasClass('skeleton__inner')).toBe(true)
  })

  describe('when passed an unknown shape', () => {
    test('renders no shapes', () => {
      const { enzymeWrapper } = setup({ unknownShape: true })
      const items = enzymeWrapper.find('.skeleton__item')

      expect(items.children().length).toEqual(0)
    })
  })

  describe('when passed a single shape', () => {
    test('renders a single shape', () => {
      const { enzymeWrapper } = setup()
      const items = enzymeWrapper.find('.skeleton__item')

      expect(items.length).toEqual(1)
      expect(items.at(0).prop('style')).toEqual({
        borderRadius: '0.1875rem',
        height: '0.75rem',
        left: '0.625rem',
        top: '0.75rem',
        width: '12.5rem'
      })
    })
  })

  describe('when passed a multiple shapes', () => {
    test('renders a multiple shapes', () => {
      const { enzymeWrapper } = setup({ multiShape: true })
      const items = enzymeWrapper.find('.skeleton__item')

      expect(items.length).toEqual(2)
      expect(items.at(0).prop('style')).toEqual({
        borderRadius: '0.1875rem',
        height: '0.75rem',
        left: '0.625rem',
        top: '0.75rem',
        width: '12.5rem'
      })
      expect(items.at(1).prop('style')).toEqual({
        borderRadius: '0.1875rem',
        height: '0.75rem',
        left: '1.875rem',
        top: '0.75rem',
        width: '6.25rem'
      })
    })
  })
})
