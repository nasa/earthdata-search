import {
  createEvent,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CopyableText from '../CopyableText'

import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const setup = setupTest({
  Component: CopyableText,
  defaultProps: {
    text: 'The text'
  }
})

describe('CopyableText', () => {
  test('renders the text', () => {
    setup()

    expect(screen.getByRole('button', { value: 'The text' })).toBeInTheDocument()
  })

  describe('when a classname is provided', () => {
    test('adds the classname', () => {
      setup({
        overrideProps: {
          className: 'test-class'
        }
      })

      expect(screen.getByRole('button', { value: 'The text' })).toHaveClass('test-class')
    })
  })

  describe('when clicked', () => {
    test('prevents event propagation', async () => {
      const stopPropagationMock = jest.fn()

      setup()

      const button = screen.getByRole('button', { value: 'The text' })

      const clickEvent = createEvent.click(button)
      clickEvent.stopPropagation = stopPropagationMock

      fireEvent(button, clickEvent)

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      expect(stopPropagationMock).toHaveBeenCalledWith()
    })

    describe('when an onClick method is defined', () => {
      test('calls the onClick method', async () => {
        const { props, user } = setup({
          overrideProps: {
            onClick: jest.fn()
          }
        })

        const button = screen.getByRole('button', { value: 'The text' })
        await user.click(button)

        await waitFor(() => {
          expect(props.onClick).toHaveBeenCalledTimes(1)
        })

        expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
          type: 'click'
        }))
      })
    })

    describe('when the browser supports navigator.clipboard.writeText', () => {
      describe('when a success message is not defined', () => {
        test('does not display a toast', async () => {
          const { user } = setup()

          const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')

          const button = screen.getByRole('button', { value: 'The text' })
          await user.click(button)

          expect(addToast).toHaveBeenCalledTimes(0)

          expect(writeTextSpy).toHaveBeenCalledTimes(1)
          expect(writeTextSpy).toHaveBeenCalledWith('The text')
        })
      })

      describe('when a success message is defined', () => {
        describe('when the success message is a string', () => {
          test('displays a toast', async () => {
            const { user } = setup({
              overrideProps: {
                successMessage: 'Copy successful'
              }
            })

            const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')

            const button = screen.getByRole('button', { value: 'The text' })
            await user.click(button)

            expect(addToast).toHaveBeenCalledTimes(1)
            expect(addToast).toHaveBeenCalledWith(
              'Copy successful',
              {
                appearance: 'success',
                autoDismiss: true
              }
            )

            expect(writeTextSpy).toHaveBeenCalledTimes(1)
            expect(writeTextSpy).toHaveBeenCalledWith('The text')
          })
        })

        describe('when the success message is a function', () => {
          test('passes arguments to the function', async () => {
            const successMessageMock = jest.fn(() => 'This is the success message')

            const { user } = setup({
              overrideProps: {
                successMessage: successMessageMock
              }
            })

            const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')

            const button = screen.getByRole('button', { value: 'The text' })
            await user.click(button)

            expect(successMessageMock).toHaveBeenCalledTimes(1)
            expect(successMessageMock).toHaveBeenCalledWith({ text: 'The text' })

            expect(writeTextSpy).toHaveBeenCalledTimes(1)
            expect(writeTextSpy).toHaveBeenCalledWith('The text')
          })
        })
      })
    })

    describe('when the browser does not support navigator.clipboard.writeText', () => {
      describe('when a failure message is not defined', () => {
        test('does not display a toast', async () => {
          const { user } = setup()

          const button = screen.getByRole('button', { value: 'The text' })
          await user.click(button)

          expect(addToast).toHaveBeenCalledTimes(0)
        })
      })

      describe('when a failure message is defined', () => {
        describe('when the success message is a string', () => {
          test('displays a toast', async () => {
            const { user } = setup({
              overrideProps: {
                failureMessage: 'Copy unsuccessful'
              }
            })

            jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => {
              throw new Error('The clipboard API is not supported')
            })

            const button = screen.getByRole('button', { value: 'The text' })
            await user.click(button)

            expect(addToast).toHaveBeenCalledTimes(1)
            expect(addToast).toHaveBeenCalledWith(
              'Copy unsuccessful',
              {
                appearance: 'error',
                autoDismiss: true
              }
            )
          })
        })

        describe('when the failure message is a function', () => {
          test('passes arguments to the function', async () => {
            const { props, user } = setup({
              overrideProps: {
                failureMessage: jest.fn(() => 'This is the failure message')
              }
            })

            jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => {
              throw new Error('The clipboard API is not supported')
            })

            const button = screen.getByRole('button', { value: 'The text' })
            await user.click(button)

            expect(props.failureMessage).toHaveBeenCalledTimes(1)
            expect(props.failureMessage).toHaveBeenCalledWith({ text: 'The text' })
          })
        })

        test('displays a toast', async () => {
          const { user } = setup({
            overrideProps: {
              failureMessage: ({ text }) => `This is the failure message: ${text}`
            }
          })

          jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => {
            throw new Error('The clipboard API is not supported')
          })

          const button = screen.getByRole('button', { value: 'The text' })
          await user.click(button)

          expect(addToast).toHaveBeenCalledTimes(1)
          expect(addToast).toHaveBeenCalledWith(
            'This is the failure message: The text',
            {
              appearance: 'error',
              autoDismiss: true
            }
          )
        })
      })
    })

    describe('when textToCopy is provided', () => {
      describe('when text is provided as a string', () => {
        test('copies the text to the clipboard', async () => {
          const { user } = setup({
            overrideProps: {
              textToCopy: 'Some other text to copy'
            }
          })

          const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')

          const button = screen.getByRole('button', { value: 'The text' })
          await user.click(button)

          expect(writeTextSpy).toHaveBeenCalledTimes(1)
          expect(writeTextSpy).toHaveBeenCalledWith('Some other text to copy')
        })
      })

      describe('when text is provided as function', () => {
        test('calls the function with arguments and copies the text to the clipboard', async () => {
          const { props, user } = setup({
            overrideProps: {
              textToCopy: jest.fn(() => 'Some other text to copy')
            }
          })

          const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')

          const button = screen.getByRole('button', { value: 'The text' })
          await user.click(button)

          expect(writeTextSpy).toHaveBeenCalledTimes(1)
          expect(writeTextSpy).toHaveBeenCalledWith('Some other text to copy')

          expect(props.textToCopy).toHaveBeenCalledTimes(1)
          expect(props.textToCopy).toHaveBeenCalledWith({ text: 'The text' })
        })
      })
    })
  })
})
