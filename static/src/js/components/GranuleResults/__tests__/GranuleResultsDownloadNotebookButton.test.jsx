import {
  screen,
  waitFor,
  createEvent,
  fireEvent
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import {
  GranuleResultsDownloadNotebookButton,
  CustomDownloadNotebookToggle
} from '../GranuleResultsDownloadNotebookButton'

Object.defineProperty(window, 'location', {
  get() {
    return { href: 'https://www.test-location.com/?param=value' }
  }
})

const setup = setupTest({
  Component: GranuleResultsDownloadNotebookButton,
  defaultProps: {
    collectionQuerySpatial: {},
    generateNotebook: {},
    generateNotebookTag: {
      variableConceptId: 'V-123456789-TESTPROV'
    },
    granuleId: 'G123456789-TESTPROV',
    onGenerateNotebook: jest.fn()
  }
})

describe('GranuleResultsDownloadNotebookButton component', () => {
  describe('when the Generate Notebook button is clicked', () => {
    describe('when a bounding box is not applied', () => {
      test('calls onGenerateNotebook without a bounding box', async () => {
        const { props, user } = setup()

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          })
        })

        expect(props.onGenerateNotebook).toHaveBeenCalledTimes(1)
      })
    })

    describe('when a bounding box is applied', () => {
      test('calls onGenerateNotebook with a bounding box', async () => {
        const { props, user } = setup({
          overrideProps: {
            collectionQuerySpatial: {
              boundingBox: ['-1,0,1,0']
            }
          }
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            boundingBox: '-1,0,1,0',
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          })
        })

        expect(props.onGenerateNotebook).toHaveBeenCalledTimes(1)
      })
    })

    describe('when a variable id is not applied', () => {
      test('calls onGenerateNotebook without a variable id', async () => {
        const { props, user } = setup({
          overrideProps: {
            generateNotebookTag: {}
          }
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(props.onGenerateNotebook).toHaveBeenCalledWith({
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value'
          })
        })

        expect(props.onGenerateNotebook).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when clicking the dropdown', () => {
    test('calls stopPropagation', async () => {
      const stopPropagationMock = jest.fn()

      const { user } = setup()

      const dropdownButton = screen.getByLabelText('Download sample notebook')

      await user.click(dropdownButton)

      // eslint-disable-next-line capitalized-comments
      // createEvent and fireEvent are used here to enable mocking of stopPropagation
      const clickEvent = createEvent.click(dropdownButton)
      clickEvent.stopPropagation = stopPropagationMock

      fireEvent(dropdownButton, clickEvent)

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })
})

const setupCustomToggle = setupTest({
  Component: CustomDownloadNotebookToggle,
  defaultProps: {
    id: 'G-123456789',
    onClick: jest.fn()
  }
})

describe('CustomDownloadNotebookToggle component', () => {
  test('calls expected event methods on download click', async () => {
    const stopPropagationMock = jest.fn()
    const preventDefaultMock = jest.fn()

    const mockClickEvent = {
      stopPropagation: stopPropagationMock,
      preventDefault: preventDefaultMock
    }

    const { props } = setupCustomToggle()

    const dropdownButton = screen.getByLabelText('Download sample notebook')

    // eslint-disable-next-line capitalized-comments
    // createEvent and fireEvent are used here to enable mocking of stopPropagation
    const clickEvent = createEvent.click(dropdownButton)

    clickEvent.stopPropagation = stopPropagationMock
    clickEvent.preventDefault = preventDefaultMock

    fireEvent(dropdownButton, clickEvent)

    expect(mockClickEvent.stopPropagation).toHaveBeenCalledTimes(1)
    expect(mockClickEvent.stopPropagation).toHaveBeenCalledWith()

    expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
    expect(mockClickEvent.preventDefault).toHaveBeenCalledWith()

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })
})
