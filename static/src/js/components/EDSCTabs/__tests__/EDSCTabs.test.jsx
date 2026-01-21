import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCTabs from '../EDSCTabs'

const setup = setupTest({
  Component: EDSCTabs,
  defaultProps: {
    children: []
  }
})

describe('EDSCTabs component', () => {
  test('should render the tabs', () => {
    setup({
      overrideProps: {
        children: [
          'Test children'
        ]
      }
    })

    expect(screen.getByRole('tablist')).toHaveTextContent('Test children')
  })

  describe('when a classname is provided', () => {
    test('should add the classname', () => {
      const { container } = setup({
        overrideProps: {
          children: [
            'Test children'
          ],
          className: 'test-classname'
        }
      })

      // eslint-disable-next-line testing-library/no-node-access
      expect(container.querySelector('.edsc-tabs').className).toContain('test-classname')
    })
  })

  describe('when no children are provided', () => {
    test('should do nothing', () => {
      setup()

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    })
  })

  describe('when falsy are provided', () => {
    test('should filter falsy children', () => {
      setup({
        overrideProps: {
          children: [
            'Test children',
            false
          ]
        }
      })

      expect(screen.getAllByRole('tablist')).toHaveLength(1)
    })
  })

  describe('when padding is set to false', () => {
    test('should add the class', () => {
      const { container } = setup({
        overrideProps: {
          padding: false,
          children: [
            'Test children'
          ]
        }
      })

      // eslint-disable-next-line testing-library/no-node-access
      expect(container.querySelector('.edsc-tabs').className).toContain('edsc-tabs--no-padding')
    })
  })
})
