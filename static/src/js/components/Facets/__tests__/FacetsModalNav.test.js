import React from 'react'
import {
  render,
  screen,
  createEvent,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import FacetsModalNav from '../FacetsModalNav'

const activeLetters = [
  '#',
  'A',
  'D',
  'Z'
]

const scrollIntoViewMock = jest.fn()

const headingMocks = [
  document.createElement('h2'),
  document.createElement('h2')
]
headingMocks[0].id = 'facet-modal__number'
headingMocks[0].scrollIntoView = scrollIntoViewMock

headingMocks[1].id = 'facet-modal__B'
headingMocks[1].scrollIntoView = scrollIntoViewMock

const mockDiv = document.createElement('div')
mockDiv.appendChild(headingMocks[0])
mockDiv.appendChild(headingMocks[1])

const modalInnerRefMock = {
  current: mockDiv
}

describe('FacetsModalNav component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('renders correctly', () => {
    test('when rendering an empty list', () => {
      render(<FacetsModalNav activeLetters={[]} modalInnerRef={modalInnerRefMock} />)

      expect(screen.queryByText('Jump:')).toBeInTheDocument()
      expect(screen.queryAllByRole('link').length).toEqual(0)
    })

    describe('when rendering a list with active letters', () => {
      test('renders the renders the alphabet', () => {
        render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

        const nav = screen.queryByRole('navigation')

        expect(nav.textContent).toContain('Jump:')
        expect(nav.textContent).toContain('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      })

      test('renders the active links', () => {
        render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

        const links = screen.queryAllByRole('link')

        expect(links.length).toEqual(4)
        expect(links[0].textContent).toBe('#')
        expect(links[1].textContent).toBe('A')
        expect(links[2].textContent).toBe('D')
        expect(links[3].textContent).toBe('Z')
      })
    })

    describe('when clicking an active list item', () => {
      test('prevents the default link action', async () => {
        render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

        const link = screen.queryByRole('link', { name: '#' })
        const clickEvent = createEvent.click(link)

        fireEvent(link, clickEvent)

        expect(clickEvent.defaultPrevented).toEqual(true)
      })

      describe('when the link href does not exist in the ref', () => {
        test('does not scroll to any element', async () => {
          const user = userEvent.setup()

          render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

          const link = screen.queryByRole('link', { name: 'A' })
          await user.click(link)

          expect(scrollIntoViewMock).toHaveBeenCalledTimes(0)
        })
      })

      describe('when scrollIntoView is supported', () => {
        test('finds the right element to scroll to', async () => {
          const user = userEvent.setup()

          render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

          const link = screen.queryByRole('link', { name: '#' })
          await user.click(link)

          expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
        })
      })

      describe('when scrollIntoView is not supported', () => {
        test('finds the right element to scroll to', async () => {
          const user = userEvent.setup()

          const originalScrollIntoView = headingMocks[0].scrollIntoView

          delete headingMocks[0].scrollIntoView

          render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

          const link = screen.queryByRole('link', { name: '#' })
          await user.click(link)

          expect(scrollIntoViewMock).toHaveBeenCalledTimes(0)
          expect(mockDiv.scrollTop).toEqual(-55)

          headingMocks[0].scrollIntoView = originalScrollIntoView
        })
      })

      describe('when clicking an inactive list item', () => {
        test('does not fire any scroll event', () => {
          const user = userEvent.setup()

          render(<FacetsModalNav activeLetters={activeLetters} modalInnerRef={modalInnerRefMock} />)

          const span = screen.queryByText('B')

          user.click(span)

          expect(scrollIntoViewMock).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})
