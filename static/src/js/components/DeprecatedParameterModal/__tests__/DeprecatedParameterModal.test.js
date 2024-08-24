import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import '@testing-library/jest-dom'

import DeprecatedParameterModal from '../DeprecatedParameterModal'

const errorMessage = 'Oops! It looks like you\'ve used an old web address...'

const setup = (overrideProps) => {
  const onToggleDeprecatedParameterModal = jest.fn()
  const props = {
    deprecatedUrlParams: ['test'],
    isOpen: true,
    onToggleDeprecatedParameterModal,
    ...overrideProps
  }

  render(<DeprecatedParameterModal {...props} />)

  return {
    onToggleDeprecatedParameterModal
  }
}

describe('DeprecatedParameterModal component', () => {
  describe('when isOpen is false', () => {
    test('should not render a Modal', () => {
      setup({ isOpen: false })
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  describe('when isOpen is true', () => {
    test('should render a title', () => {
      setup()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    test('should render information', () => {
      setup()
      const warning1 = 'Occasionally, we need to make changes to our supported URL parameters.'
      const warning2 = 'wiki page for more information on the supported URL parameters.'
      expect(screen.getByText(warning1, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(warning2, { exact: false })).toBeInTheDocument()
    })

    describe('displays the deprecated parameters section', () => {
      test('when only one param is provided', () => {
        setup()
        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameter has been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test')).toBeInTheDocument()
      })

      test('when two params is provided', () => {
        setup({
          deprecatedUrlParams: ['test', 'another test']
        })

        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameters have been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test and another test')).toBeInTheDocument()
      })

      test('when three or more params are provided', () => {
        setup({
          deprecatedUrlParams: ['test', 'another test', 'another another test']
        })

        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameters have been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test, another test and another another test')).toBeInTheDocument()
      })
    })
  })
})
