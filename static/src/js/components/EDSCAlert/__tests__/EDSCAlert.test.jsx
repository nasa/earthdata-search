import React from 'react'
import { screen } from '@testing-library/react'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCAlert from '../EDSCAlert'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

vi.mock('../../EDSCIcon/EDSCIcon', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: EDSCAlert,
  defaultProps: {
    bootstrapVariant: 'primary'
  }
})

describe('EDSCAlert component', () => {
  test('should render the alert', () => {
    setup()

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  describe('when an class name is provided', () => {
    test('should add the class name', () => {
      setup({
        overrideProps: {
          className: 'test-class-name'
        }
      })

      expect(screen.getByRole('alert')).toHaveClass('test-class-name')
    })
  })

  describe('when a variant is declared', () => {
    test('should add the variant class name', () => {
      setup({
        overrideProps: {
          variant: 'test-variant'
        }
      })

      expect(screen.getByRole('alert')).toHaveClass('edsc-alert--test-variant')
    })
  })

  describe('when children are provided', () => {
    test('should render the children', () => {
      setup({
        overrideProps: {
          children: <div className="test-child">Test</div>
        }
      })

      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  describe('when an icon is provided', () => {
    test('should render the icon', () => {
      setup({
        overrideProps: {
          icon: FaQuestionCircle
        }
      })

      expect(EDSCIcon).toHaveBeenCalledTimes(1)
      expect(EDSCIcon).toHaveBeenCalledWith({
        icon: FaQuestionCircle,
        className: 'edsc-alert__icon'
      }, {})
    })
  })
})
