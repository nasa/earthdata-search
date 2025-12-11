import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import DeprecatedParameterModal from '../DeprecatedParameterModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const errorMessage = 'Oops! It looks like you\'ve used an old web address...'

const setup = setupTest({
  Component: DeprecatedParameterModal,
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.DEPRECATED_PARAMETER,
        modalData: {
          deprecatedUrlParams: ['test']
        },
        setOpenModal: jest.fn()
      }
    }
  }
})

describe('DeprecatedParameterModal component', () => {
  describe('when isOpen is false', () => {
    test('should not render a Modal', () => {
      setup({
        overrideZustandState: {
          ui: {
            modals: {
              openModal: null
            }
          }
        }
      })

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

    test('should call setOpenModal when the modal is closed', async () => {
      const { user, zustandState } = setup()

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })

    describe('displays the deprecated parameters section', () => {
      test('when only one param is provided', () => {
        setup()

        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameter has been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test')).toBeInTheDocument()
      })

      test('when two params is provided', () => {
        setup({
          overrideZustandState: {
            ui: {
              modals: {
                modalData: {
                  deprecatedUrlParams: ['test', 'another test']
                }
              }
            }
          }
        })

        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameters have been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test and another test')).toBeInTheDocument()
      })

      test('when three or more params are provided', () => {
        setup({
          overrideZustandState: {
            ui: {
              modals: {
                modalData: {
                  deprecatedUrlParams: ['test', 'another test', 'another another test']
                }
              }
            }
          }
        })

        const deprecatedParamErrorWrapper = screen.getByText('The following URL parameters have been deprecated:')
        expect(within(deprecatedParamErrorWrapper).getByText('test, another test and another another test')).toBeInTheDocument()
      })
    })
  })
})
