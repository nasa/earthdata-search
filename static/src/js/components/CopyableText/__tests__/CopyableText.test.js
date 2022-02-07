import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as addToast from '../../../util/addToast'

import CopyableText from '../CopyableText'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()

  Object.assign(navigator, {
    clipboard: {}
  })
})

function setup(overrideProps) {
  const props = {
    ...overrideProps
  }
  const enzymeWrapper = shallow(<CopyableText {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CopyableText', () => {
  test('renders the text', () => {
    const { enzymeWrapper } = setup({
      text: 'The text'
    })

    expect(enzymeWrapper.text()).toEqual('The text')
  })

  describe('when a classname is provided', () => {
    test('adds the classname', () => {
      const { enzymeWrapper } = setup({
        text: 'The text',
        className: 'test-class'
      })

      expect(enzymeWrapper.props().className).toContain('test-class')
    })
  })

  describe('when clicked', () => {
    test('prevents event propagation', () => {
      const stopPropagationMock = jest.fn()
      Object.assign(navigator, {
        clipboard: {
          writeText: () => {}
        }
      })

      const { enzymeWrapper } = setup({
        text: 'The text',
        className: 'test-class'
      })

      enzymeWrapper.simulate('click', {
        stopPropagation: stopPropagationMock
      })

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })

    describe('when an onClick method is defined', () => {
      test('calls the onClick method', () => {
        const stopPropagationMock = jest.fn()
        const onClickMock = jest.fn()
        Object.assign(navigator, {
          clipboard: {
            writeText: () => {}
          }
        })

        const { enzymeWrapper } = setup({
          text: 'The text',
          className: 'test-class',
          onClick: onClickMock
        })

        enzymeWrapper.simulate('click', {
          stopPropagation: stopPropagationMock
        })

        expect(onClickMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the browser supports navigator.clipboard.writeText', () => {
      describe('when a success message is not defined', () => {
        test('does not display a toast', async () => {
          const stopPropagationMock = jest.fn()
          Object.assign(navigator, {
            clipboard: {
              writeText: () => {}
            }
          })
          const addToastMock = jest.spyOn(addToast, 'addToast')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class'
          })

          await enzymeWrapper.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(addToastMock).toHaveBeenCalledTimes(0)
        })
      })

      describe('when a success message is defined', () => {
        describe('when the success message is a string', () => {
          test('displays a toast', async () => {
            const stopPropagationMock = jest.fn()
            Object.assign(navigator, {
              clipboard: {
                writeText: () => {}
              }
            })
            const addToastMock = jest.spyOn(addToast, 'addToast')

            const { enzymeWrapper } = setup({
              text: 'The text',
              className: 'test-class',
              successMessage: 'Copy successful'
            })

            await enzymeWrapper.simulate('click', {
              stopPropagation: stopPropagationMock
            })

            expect(addToastMock).toHaveBeenCalledTimes(1)
            expect(addToastMock).toHaveBeenCalledWith(
              'Copy successful',
              {
                appearance: 'success',
                autoDismiss: true
              }
            )
          })
        })

        describe('when the success message is a function', () => {
          test('passes arguments to the function', async () => {
            const stopPropagationMock = jest.fn()
            Object.assign(navigator, {
              clipboard: {
                writeText: () => {}
              }
            })

            const successMessageMock = jest.fn(() => 'This is the success message')

            const { enzymeWrapper } = setup({
              text: 'The text',
              className: 'test-class',
              successMessage: successMessageMock
            })

            await enzymeWrapper.simulate('click', {
              stopPropagation: stopPropagationMock
            })

            expect(successMessageMock).toHaveBeenCalledTimes(1)
            expect(successMessageMock).toHaveBeenCalledWith({ text: 'The text' })
          })
        })

        test('displays a toast', async () => {
          const stopPropagationMock = jest.fn()
          Object.assign(navigator, {
            clipboard: {
              writeText: () => {}
            }
          })
          const addToastMock = jest.spyOn(addToast, 'addToast')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class',
            successMessage: ({ text }) => `This is the success message: ${text}`
          })

          await enzymeWrapper.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(addToastMock).toHaveBeenCalledTimes(1)
          expect(addToastMock).toHaveBeenCalledWith(
            'This is the success message: The text',
            {
              appearance: 'success',
              autoDismiss: true
            }
          )
        })
      })
    })

    describe('when the browser does not support navigator.clipboard.writeText', () => {
      describe('when a failure message is not defined', () => {
        test('does not display a toast', async () => {
          const stopPropagationMock = jest.fn()
          const addToastMock = jest.spyOn(addToast, 'addToast')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class'
          })

          await enzymeWrapper.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(addToastMock).toHaveBeenCalledTimes(0)
        })
      })

      describe('when a failure message is defined', () => {
        describe('when the success message is a string', () => {
          test('displays a toast', async () => {
            const stopPropagationMock = jest.fn()
            const addToastMock = jest.spyOn(addToast, 'addToast')

            const { enzymeWrapper } = setup({
              text: 'The text',
              className: 'test-class',
              failureMessage: 'Copy unsuccessful'
            })

            await enzymeWrapper.simulate('click', {
              stopPropagation: stopPropagationMock
            })

            expect(addToastMock).toHaveBeenCalledTimes(1)
            expect(addToastMock).toHaveBeenCalledWith(
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
            const stopPropagationMock = jest.fn()

            const failureMessageMock = jest.fn(() => 'This is the failure message')

            const { enzymeWrapper } = setup({
              text: 'The text',
              className: 'test-class',
              failureMessage: failureMessageMock
            })

            await enzymeWrapper.simulate('click', {
              stopPropagation: stopPropagationMock
            })

            expect(failureMessageMock).toHaveBeenCalledTimes(1)
            expect(failureMessageMock).toHaveBeenCalledWith({ text: 'The text' })
          })
        })

        test('displays a toast', async () => {
          const stopPropagationMock = jest.fn()
          const addToastMock = jest.spyOn(addToast, 'addToast')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class',
            failureMessage: ({ text }) => `This is the failure message: ${text}`
          })

          await enzymeWrapper.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(addToastMock).toHaveBeenCalledTimes(1)
          expect(addToastMock).toHaveBeenCalledWith(
            'This is the failure message: The text',
            {
              appearance: 'error',
              autoDismiss: true
            }
          )
        })
      })
    })

    describe('when textToCopy is not provided', () => {
      test('copies the text to the clipboard', () => {
        Object.assign(navigator, {
          clipboard: {
            writeText: () => {}
          }
        })
        jest.spyOn(navigator.clipboard, 'writeText')

        const { enzymeWrapper } = setup({
          text: 'The text',
          className: 'test-class'
        })

        enzymeWrapper.simulate('click', {
          stopPropagation: () => {}
        })

        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('The text')
      })
    })

    describe('when textToCopy is provided', () => {
      describe('when text is provided as a string', () => {
        test('copies the text to the clipboard', () => {
          Object.assign(navigator, {
            clipboard: {
              writeText: () => {}
            }
          })
          jest.spyOn(navigator.clipboard, 'writeText')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class',
            textToCopy: 'Some other text to copy'
          })

          enzymeWrapper.simulate('click', {
            stopPropagation: () => {}
          })

          expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
          expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Some other text to copy')
        })
      })

      describe('when text is provided as function', () => {
        test('calls the function with arguments', () => {
          Object.assign(navigator, {
            clipboard: {
              writeText: () => {}
            }
          })
          jest.spyOn(navigator.clipboard, 'writeText')

          const textToCopyMock = jest.fn(() => 'Some other text to copy')

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class',
            textToCopy: textToCopyMock
          })

          enzymeWrapper.simulate('click', {
            stopPropagation: () => {}
          })

          expect(textToCopyMock).toHaveBeenCalledTimes(1)
          expect(textToCopyMock).toHaveBeenCalledWith({ text: 'The text' })
        })

        test('copies the text to the clipboard', () => {
          Object.assign(navigator, {
            clipboard: {
              writeText: () => {}
            }
          })
          jest.spyOn(navigator.clipboard, 'writeText')

          const textToCopyMock = jest.fn(({ text }) => `Some other text to copy: ${text}`)

          const { enzymeWrapper } = setup({
            text: 'The text',
            className: 'test-class',
            textToCopy: textToCopyMock
          })

          enzymeWrapper.simulate('click', {
            stopPropagation: () => {}
          })

          expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
          expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Some other text to copy: The text')
        })
      })
    })
  })
})
