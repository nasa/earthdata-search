import React from 'react'
import {
  fireEvent,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PanelItem from '../PanelItem'

describe('PanelItem component', () => {
  describe('when provided a string as children', () => {
    test('renders the children', () => {
      render(
        <PanelItem>
          I am some content
        </PanelItem>
      )

      expect(screen.getByText('I am some content')).toBeInTheDocument()
    })
  })

  describe('when a header is provided', () => {
    test('renders the header', () => {
      render(
        <PanelItem
          header={<div>I am the header content</div>}
        >
          I am some content
        </PanelItem>
      )

      expect(screen.getByText('I am the header content')).toBeInTheDocument()
    })
  })

  describe('when a footer is provided', () => {
    test('renders the footer', () => {
      render(
        <PanelItem
          footer={<div>I am the footer content</div>}
        >
          I am some content
        </PanelItem>
      )

      expect(screen.getByText('I am the footer content')).toBeInTheDocument()
    })
  })

  describe('when provided a React element as children', () => {
    describe('when the panel is not active', () => {
      test('renders the children with the isActive prop set to false', () => {
        const CustomChild = jest.fn(() => (<div>I am a custom child</div>))

        render(
          <PanelItem>
            <CustomChild />
          </PanelItem>
        )

        expect(screen.getByText('I am a custom child')).toBeInTheDocument()
        expect(CustomChild).toHaveBeenCalledTimes(1)
        expect(CustomChild).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }), {})
      })
    })

    describe('when the panel is active', () => {
      test('renders the children with the isActive prop set to true', () => {
        const CustomChild = jest.fn(() => (<div>I am a custom child</div>))

        render(
          <PanelItem isActive>
            <CustomChild />
          </PanelItem>
        )

        expect(screen.getByText('I am a custom child')).toBeInTheDocument()
        expect(CustomChild).toHaveBeenCalledTimes(1)
        expect(CustomChild).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }), {})
      })
    })
  })

  describe('when scrolling the inner wrapper past the threshold', () => {
    test('sets the hasScrolled class', async () => {
      const CustomChild = jest.fn(() => (
        <div style={{ height: '1000px' }}>I am a custom child</div>
      ))

      render(
        <PanelItem isActive>
          <CustomChild />
        </PanelItem>
      )

      // eslint-disable-next-line testing-library/no-node-access
      const scrollableContainer = document.querySelector('.simplebar-content-wrapper')
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 21 } })

      // Replace container.firstChild.classList.contains with Testing Library's methods
      const panel = screen.getByTestId('panel-item')
      expect(panel).toHaveClass('panel-item--has-scrolled')
    })

    describe('when scrolling the inner wrapper past the threshold and returning', () => {
      test('sets and removes the hasScrolled class', async () => {
        const CustomChild = jest.fn(() => (
          <div style={{ height: '1000px' }}>I am a custom child</div>
        ))

        render(
          <PanelItem isActive>
            <CustomChild />
          </PanelItem>
        )

        // eslint-disable-next-line testing-library/no-node-access
        const scrollableContainer = document.querySelector('.simplebar-content-wrapper')

        // Scroll past threshold
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: 21 } })
        const panelAfterScroll = screen.getByTestId('panel-item')
        expect(panelAfterScroll).toHaveClass('panel-item--has-scrolled')

        // Scroll back above threshold
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: 19 } })
        const panelAfterScrollBack = screen.getByTestId('panel-item')
        expect(panelAfterScrollBack).not.toHaveClass('panel-item--has-scrolled')
      })
    })
  })

  describe('when provided a back button options', () => {
    test('renders the button', () => {
      render(
        <PanelItem
          backButtonOptions={
            {
              callback: () => {},
              location: '0.0.1'
            }
          }
        >
          I am some content
        </PanelItem>
      )

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    })

    describe('when text is provided to the backButtonOptions', () => {
      test('renders the custom text', () => {
        render(
          <PanelItem
            backButtonOptions={
              {
                location: '0.0.1',
                text: 'Previous Step'
              }
            }
          >
            I am some content
          </PanelItem>
        )

        expect(screen.getByRole('button', { name: 'Back to Previous Step' })).toBeInTheDocument()
      })
    })

    describe('when the button is clicked', () => {
      describe('when the callback is a function', () => {
        test('fires the callback', async () => {
          const user = userEvent.setup()
          const onChangePanelMock = jest.fn()
          const backButtonCallbackMock = jest.fn()

          render(
            <PanelItem
              onChangePanel={onChangePanelMock}
              backButtonOptions={
                {
                  callback: backButtonCallbackMock,
                  location: '0.0.1',
                  text: 'Previous Step'
                }
              }
            >
              I am some content
            </PanelItem>
          )

          await user.click(screen.getByRole('button', { name: 'Back to Previous Step' }))

          expect(backButtonCallbackMock).toHaveBeenCalledTimes(1)
        })
      })

      test('fires the onChangePanel function', async () => {
        const user = userEvent.setup()
        const onChangePanelMock = jest.fn()
        const backButtonCallbackMock = jest.fn()

        render(
          <PanelItem
            onChangePanel={onChangePanelMock}
            backButtonOptions={
              {
                callback: backButtonCallbackMock,
                location: '0.0.1',
                text: 'Previous Step'
              }
            }
          >
            I am some content
          </PanelItem>
        )

        await user.click(screen.getByRole('button', { name: 'Back to Previous Step' }))

        expect(onChangePanelMock).toHaveBeenCalledTimes(1)
        expect(onChangePanelMock).toHaveBeenCalledWith('0.0.1')
      })
    })
  })

  describe('when scrollable is set to false', () => {
    test('renders content without scrollable behavior', () => {
      render(
        <PanelItem scrollable={false}>
          I am some content
        </PanelItem>
      )

      const content = screen.getByText('I am some content')
      expect(content).toBeVisible()
    })
  })
})
