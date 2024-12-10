import React from 'react'
import {
  render,
  screen,
  waitFor,
  createEvent,
  fireEvent,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { act } from 'react-dom/test-utils'
import {
  GranuleResultsDownloadNotebookButton,
  CustomDownloadNotebookToggle
} from '../GranuleResultsDownloadNotebookButton'

Object.defineProperty(window, 'location', {
  get() {
    return { href: 'https://www.test-location.com/?param=value' }
  }
})

function setup(overrideProps) {
  const user = userEvent.setup()

  const props = {
    collectionQuerySpatial: {},
    generateNotebook: {},
    generateNotebookTag: {
      variableConceptId: 'V-123456789-TESTPROV'
    },
    granuleId: 'G123456789-TESTPROV',
    onGenerateNotebook: jest.fn(),
    ...overrideProps
  }

  render(<GranuleResultsDownloadNotebookButton {...props} />)

  return {
    props,
    user
  }
}

describe('GranuleResultsDownloadNotebookButton component', () => {
  describe('when the Generate Notebook button is clicked', () => {
    describe('when a bounding box is not applied', () => {
      test('calls onGenerateNotebook without a bounding box', async () => {
        const { props, user } = setup()

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await act(async () => {
          await user.click(dropdownButton)
        })

        const dropdownMenu = screen.getByTestId('dropdown-menu')
        const downloadButton = within(dropdownMenu).getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          })
        })
      })
    })

    describe('when a bounding box is applied', () => {
      test('calls onGenerateNotebook with a bounding box', async () => {
        const { props, user } = setup({
          collectionQuerySpatial: {
            boundingBox: ['-1,0,1,0']
          }
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await act(async () => {
          await user.click(dropdownButton)
        })

        const dropdownMenu = screen.getByTestId('dropdown-menu')
        const downloadButton = within(dropdownMenu).getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            boundingBox: '-1,0,1,0',
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          })
        })
      })
    })

    describe('when a variable id is not applied', () => {
      test('calls onGenerateNotebook without a variable id', async () => {
        const { props, user } = setup({
          generateNotebookTag: {}
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await act(async () => {
          await user.click(dropdownButton)
        })

        const dropdownMenu = screen.getByTestId('dropdown-menu')
        const downloadButton = within(dropdownMenu).getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value'
          })
        })
      })
    })
  })

  describe('when clicking the dropdown', () => {
    test('calls stopPropagation', async () => {
      const stopPropagationMock = jest.fn()

      const { user } = setup({
        generateNotebookTag: {}
      })

      const dropdownButton = screen.getByLabelText('Download sample notebook')

      await act(async () => {
        await user.click(dropdownButton)
      })

      const dropdownMenu = screen.getByTestId('dropdown-menu')
      // eslint-disable-next-line capitalized-comments
      // createEvent and fireEvent are used here to enable mocking of stopPropagation
      const clickEvent = createEvent.click(dropdownMenu)
      clickEvent.stopPropagation = stopPropagationMock

      fireEvent(dropdownMenu, clickEvent)

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('CustomDownloadNotebookToggle component', () => {
  test('calls expected event methods on download click', async () => {
    const stopPropagationMock = jest.fn()
    const preventDefaultMock = jest.fn()

    const mockClickEvent = {
      stopPropagation: stopPropagationMock,
      preventDefault: preventDefaultMock
    }

    const mockClickCallback = jest.fn()

    render(<CustomDownloadNotebookToggle id="G-123456789" onClick={mockClickCallback} />)

    const dropdownButton = screen.getByLabelText('Download sample notebook')

    // eslint-disable-next-line capitalized-comments
    // createEvent and fireEvent are used here to enable mocking of stopPropagation
    const clickEvent = createEvent.click(dropdownButton)

    clickEvent.stopPropagation = stopPropagationMock
    clickEvent.preventDefault = preventDefaultMock

    fireEvent(dropdownButton, clickEvent)

    expect(mockClickEvent.stopPropagation).toHaveBeenCalled()
    expect(mockClickEvent.preventDefault).toHaveBeenCalled()
    expect(mockClickCallback).toHaveBeenCalled()
  })
})
