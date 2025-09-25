import React from 'react'
import { screen } from '@testing-library/react'
import { FaCocktail } from 'react-icons/fa'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import MetaIcon from '../MetaIcon'
import NotAvailableIcon from '../../NotAvailableIcon/NotAvailableIcon'

jest.mock('../../NotAvailableIcon/NotAvailableIcon', () => jest.fn(() => <div />))
jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: MetaIcon,
  defaultProps: {
    icon: FaCocktail,
    id: 'icon',
    label: 'MetaIcon Label'
  }
})

describe('MetaIcon component', () => {
  test('should render an EDSCIcon', () => {
    setup()

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'meta-icon__icon',
      icon: expect.any(Function),
      size: '16'
    }, {})
  })

  test('should render the label', () => {
    setup()

    expect(screen.getByText('MetaIcon Label')).toBeInTheDocument()
  })

  describe('when setting a tooltip', () => {
    test('should render the tooltip', async () => {
      const { user } = setup({
        overrideProps: {
          tooltipContent: 'Test tooltip content'
        }
      })

      const text = screen.getByText('MetaIcon Label')
      await user.hover(text)

      expect(screen.getByText('Test tooltip content')).toBeInTheDocument()

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('data-popper-placement', 'top')
    })

    describe('when setting a custom placement', () => {
      test('should set the custom placement', async () => {
        const { user } = setup({
          overrideProps: {
            tooltipContent: 'Test tooltip content',
            placement: 'right'
          }
        })

        const text = screen.getByText('MetaIcon Label')
        await user.hover(text)

        expect(screen.getByText('Test tooltip content')).toBeInTheDocument()

        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveAttribute('data-popper-placement', 'right')
      })
    })

    describe('when provided a custom tooltip class name', () => {
      test('adds the class name', async () => {
        const { user } = setup({
          overrideProps: {
            tooltipContent: 'Test tooltip content',
            tooltipClassName: 'test-class-name'
          }
        })

        const text = screen.getByText('MetaIcon Label')
        await user.hover(text)

        expect(screen.getByText('Test tooltip content')).toBeInTheDocument()

        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('test-class-name')
      })
    })
  })

  describe('when provided iconProps', () => {
    test('should set the icon props', () => {
      setup({
        overrideProps: {
          iconProps: {
            size: '20rem'
          }
        }
      })

      expect(EDSCIcon).toHaveBeenCalledTimes(1)
      expect(EDSCIcon).toHaveBeenCalledWith({
        className: 'meta-icon__icon',
        icon: expect.any(Function),
        size: '20rem'
      }, {})
    })
  })

  describe('when metadata is provided', () => {
    test('should show the metadata', () => {
      setup({
        overrideProps: {
          metadata: 'test-metadata'
        }
      })

      expect(screen.getByText('test-metadata')).toBeInTheDocument()
    })
  })

  describe('when notAvailable is provided', () => {
    test('should show the notAvailableIcon', () => {
      setup({
        overrideProps: {
          notAvailable: true
        }
      })

      expect(NotAvailableIcon).toHaveBeenCalledTimes(1)
      expect(NotAvailableIcon).toHaveBeenCalledWith({ size: '16' }, {})
    })
  })
})
