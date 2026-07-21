import { act } from 'react'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import NlpSearchStatus from '../NlpSearchStatus'

const mockComplete = vi.fn(async () => undefined)
const mockStop = vi.fn()
const mockSetCompletion = vi.fn()

const mockSetCollectionId = vi.fn()
const mockChangeQuery = vi.fn()
const mockHandleError = vi.fn()

let capturedUseCompletionOptions: {
    onFinish?: (prompt: string, completionText: string) => void
    onError?: (error: Error) => void
} = {}

vi.mock('../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

vi.mock('@ai-sdk/react', () => ({
  useCompletion: vi.fn((options) => {
    capturedUseCompletionOptions = options

    return {
      complete: mockComplete,
      completion: '',
      isLoading: false,
      setCompletion: mockSetCompletion,
      stop: mockStop
    }
  })
}))

const setup = setupTest({
  Component: NlpSearchStatus,
  defaultZustandState: {
    collection: {
      setCollectionId: mockSetCollectionId
    },
    query: {
      changeQuery: mockChangeQuery
    },
    errors: {
      handleError: mockHandleError
    }
  },
  defaultProps: {
    activePrompt: '',
    requestId: 0,
    onStreamingChange: vi.fn(),
    onNlpSearchComplete: vi.fn(),
    onNlpSearchFailed: vi.fn()
  }
})

describe('NlpSearchStatus component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedUseCompletionOptions = {}
  })

  test('renders default status text', () => {
    setup()

    expect(screen.getByText(/waiting for Query parsing status updates/i)).toBeInTheDocument()
  })

  test('starts prompt completion when requestId and prompt are provided', async () => {
    const { props } = setup({
      overrideProps: {
        activePrompt: 'glaciers in montana ',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledWith(true)
    })

    expect(mockComplete).toHaveBeenCalledWith('glaciers in montana')
  })

  test('applies parsed NLP result and triggers completion callback', async () => {
    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'average temp in western montana last april',
        requestId: 1
      }
    })

    const completionText = [
      'Found spatial of "western montana".',
      'Found temporal of "last april".',
      'Found keyword of "average temp".',
      'Final result:',
      '{"keyword":"average temp","query":"average temp in Western montana last april","spatial":"Western montana","spatialArea":"POLYGON((-116.050002 44.358209, -116.050002 49.00139, -109.64514022973341 49.00139, -109.64514022973341 44.358209, -116.050002 44.358209))","temporal":{"startDate":"2026-04-01T00:00:00.000Z","endDate":"2026-04-30T23:59:59.999Z"}}'
    ].join('\n')

    expect(capturedUseCompletionOptions.onFinish).toBeTypeOf('function')

    act(() => {
      capturedUseCompletionOptions.onFinish!(
        'average temp in western montana last april',
        completionText
      )
    })

    await waitFor(() => {
      expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        keyword: 'average temp',
        temporal: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-30T23:59:59.999Z'
        },
        spatial: {
          boundingBox: ['-116.05,44.35821,-109.64514,49.00139']
        }
      },
      selectedRegion: {}
    })

    expect(props.onNlpSearchComplete).toHaveBeenCalledTimes(1)
  })

  test('reports parsing errors when final result is not valid json', async () => {
    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'bad payload for query',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledWith(true)
    })

    act(() => {
      capturedUseCompletionOptions.onFinish?.('prompt', 'Final result:\nnot-json')
    })

    expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
    expect(props.onStreamingChange).toHaveBeenCalledWith(false)
    expect(props.onNlpSearchFailed).toHaveBeenCalledTimes(1)
    expect(props.onNlpSearchFailed).toHaveBeenCalledWith()
  })

  test('resets UI and calls onNlpSearchFailed when onError fires', async () => {
    const { props } = setup({
      overrideProps: {
        activePrompt: 'error',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledWith(true)
    })

    act(() => {
      capturedUseCompletionOptions.onError?.(new Error('NLP service unavailable'))
    })

    expect(props.onStreamingChange).toHaveBeenCalledTimes(2)
    expect(props.onStreamingChange).toHaveBeenCalledWith(false)
    expect(props.onNlpSearchFailed).toHaveBeenCalledTimes(1)
    expect(props.onNlpSearchFailed).toHaveBeenCalledWith()
  })
})
