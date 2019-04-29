import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Skeleton from '../Skeleton'
import { url } from 'inspector';

Enzyme.configure({ adapter: new Adapter() })

function setup(options) {

  let testSkeleton

  if (!options || options.singleShape) {
    testSkeleton = [
      {
        shape: 'rectangle',
        x: 10,
        y: 12,
        height: 12,
        width: 200,
        radius: 3
      }
    ]
  } else if (options.multiShape) {
    testSkeleton = [
      {
        shape: 'rectangle',
        x: 10,
        y: 12,
        height: 12,
        width: 200,
        radius: 3
      },
      {
        shape: 'rectangle',
        x: 30,
        y: 12,
        height: 12,
        width: 100,
        radius: 3
      }
    ]
  } else if (options.unknownShape) {
    testSkeleton = [
      {
        shape: 'unknown',
        x: 10,
        y: 12,
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
    expect(innerDiv.prop('style')).toEqual({ clipPath: 'url(#skeleton_clipping_path_3)' })
  })

  describe('when passed an unknown shape', () => {
    test('renders no shapes', () => {
      const { enzymeWrapper } = setup({ unknownShape: true })
      const clipPaths = enzymeWrapper.find('clipPath')

      expect(clipPaths.children().length).toEqual(0)
    })
  })

  describe('when passed a single shape', () => {
    test('renders a single shape', () => {
      const { enzymeWrapper } = setup()
      const clipPaths = enzymeWrapper.find('clipPath')

      expect(clipPaths.children().length).toEqual(1)
      expect(clipPaths.children().at(0).props()).toEqual({
        height: '12',
        rx: '3',
        ry: '3',
        width: '200',
        x: '10',
        y: '12'
      })
    })
  })

  describe('when passed a multiple shapes', () => {
    test('renders a multiple shapes', () => {
      const { enzymeWrapper } = setup({ multiShape: true })
      const clipPaths = enzymeWrapper.find('clipPath')

      expect(clipPaths.children().length).toEqual(2)
      expect(clipPaths.children().at(0).props()).toEqual({
        height: '12',
        rx: '3',
        ry: '3',
        width: '200',
        x: '10',
        y: '12'
      })
      expect(clipPaths.children().at(1).props()).toEqual({
        height: '12',
        rx: '3',
        ry: '3',
        width: '100',
        x: '30',
        y: '12'
      })
    })
  })
})
