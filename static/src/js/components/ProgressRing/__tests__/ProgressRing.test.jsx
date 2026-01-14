import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ProgressRing from '../ProgressRing'

const setup = setupTest({
  Component: ProgressRing
})

describe('ProgressRing component', () => {
  test('should render an svg progress ring', () => {
    setup()

    expect(screen.getByRole('graphics-symbol')).toBeInTheDocument()
  })

  test('should add the correct classname', () => {
    setup()

    expect(screen.getByRole('graphics-symbol').classList).toContain('progress-ring__ring')
  })

  describe('when no size is provided', () => {
    test('should render an svg at the correct size', () => {
      setup()

      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('width', '16')
      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('height', '16')
    })

    test('should render the inner circle at the correct size', () => {
      setup()

      // We shouldn't be disabling this rule, but we need to access the DOM node to check the attributes
      /* eslint-disable testing-library/no-node-access */
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cx')).toEqual('8')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cy')).toEqual('8')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('r')).toEqual('5')
      /* eslint-enable testing-library/no-node-access */
    })
  })

  describe('when a custom classname is provided', () => {
    test('should add the correct classname', () => {
      setup({
        overrideProps: {
          className: 'test-classname'
        }
      })

      // We shouldn't be disabling this rule, but we need to access the DOM node to check the attributes
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('graphics-symbol').parentElement.className).toEqual('progress-ring test-classname')
    })
  })

  describe('when a custom size is provided', () => {
    test('should render an svg at the custom size', () => {
      setup({
        overrideProps: {
          width: 20
        }
      })

      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('width', '20')
      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('height', '20')
    })

    test('should render the inner circle at the correct size', () => {
      setup({
        overrideProps: {
          width: 20
        }
      })

      // We shouldn't be disabling this rule, but we need to access the DOM node to check the attributes
      /* eslint-disable testing-library/no-node-access */
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cx')).toEqual('10')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cy')).toEqual('10')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('r')).toEqual('7')
      /* eslint-enable testing-library/no-node-access */
    })
  })

  describe('when a custom stroke width is provided', () => {
    test('should render an svg at the provided width', () => {
      setup({
        overrideProps: {
          strokeWidth: 2,
          width: 20
        }
      })

      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('width', '20')
      expect(screen.getByRole('graphics-symbol')).toHaveAttribute('height', '20')
    })

    test('should render the inner circle radius correctly', () => {
      setup({
        overrideProps: {
          strokeWidth: 2,
          width: 20
        }
      })

      // We shouldn't be disabling this rule, but we need to access the DOM node to check the attributes
      /* eslint-disable testing-library/no-node-access */
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cx')).toEqual('10')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('cy')).toEqual('10')
      expect(screen.getByRole('graphics-symbol').querySelector('.progress-ring__progress').getAttribute('r')).toEqual('8')
      /* eslint-enable testing-library/no-node-access */
    })
  })
})
