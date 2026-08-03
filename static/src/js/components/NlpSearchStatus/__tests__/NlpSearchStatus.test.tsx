import {
  act,
  screen,
  waitFor
} from '@testing-library/react'
import WKT from 'ol/format/WKT'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import NlpSearchStatus from '../NlpSearchStatus'

const mockComplete = vi.fn(async () => undefined)
const mockStop = vi.fn()
const mockSetCompletion = vi.fn()
let mockCompletion = ''
let mockIsLoading = false

const mockSetCollectionId = vi.fn()
const mockChangeQuery = vi.fn()
const mockHandleError = vi.fn()
const mockNlpRequestStream = vi.fn(async () => ({ ok: true }))

let capturedUseCompletionOptions: {
  fetch?: (_: unknown, init?: unknown) => Promise<unknown>
    onFinish?: (prompt: string, completionText: string) => void
    onError?: (error: Error) => void
} = {}

vi.mock('../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

vi.mock('../../../util/request/nlpSearchRequest', () => ({
  default: vi.fn(function MockNlpSearchRequest(this: {stream: typeof mockNlpRequestStream}) {
    this.stream = mockNlpRequestStream
  })
}))

vi.mock('@ai-sdk/react', () => ({
  useCompletion: vi.fn((options) => {
    capturedUseCompletionOptions = options

    return {
      complete: mockComplete,
      completion: mockCompletion,
      isLoading: mockIsLoading,
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
    capturedUseCompletionOptions = {}
    mockCompletion = ''
    mockIsLoading = false
    mockComplete.mockReset()
    mockComplete.mockImplementation(async () => undefined)
    mockStop.mockReset()
    mockNlpRequestStream.mockReset()
    mockNlpRequestStream.mockImplementation(async () => ({ ok: true }))
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
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    expect(mockComplete).toHaveBeenCalledTimes(1)
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
    await act(async () => {
      capturedUseCompletionOptions.onFinish!(
        'average temp in western montana last april',
        completionText
      )
    })

    await waitFor(() => {
      expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
    })

    expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
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
    expect(props.onNlpSearchComplete).toHaveBeenCalledWith({ hasSpatial: true })
  })

  test('reports parsing errors when final result is not valid json', async () => {
    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'bad payload for query',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    await act(async () => {
      capturedUseCompletionOptions.onFinish?.('prompt', 'Final result:\nnot-json')
    })

    expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
    // Streaming is toggled on when the request starts, then toggled off after parse failure.
    expect(props.onStreamingChange).toHaveBeenCalledTimes(2)
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
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    act(() => {
      capturedUseCompletionOptions.onError?.(new Error('NLP service unavailable'))
    })

    expect(props.onStreamingChange).toHaveBeenCalledTimes(2)
    expect(props.onStreamingChange).toHaveBeenCalledWith(false)
    expect(props.onNlpSearchFailed).toHaveBeenCalledTimes(1)
    expect(props.onNlpSearchFailed).toHaveBeenCalledWith()
  })

  test('renders progress steps from streamed completion text', () => {
    mockCompletion = [
      'Analyzing your query...',
      'error: temporary server issue',
      'Found spatial of "western montana".',
      'Found temporal of "last april".',
      'Found keyword of "average temp".',
      'Final result:',
      '{}'
    ].join('\n')

    setup()

    expect(screen.getByText('Extracted spatial area of "western montana".')).toBeInTheDocument()
    expect(screen.getByText('Extracted temporal range of "last april".')).toBeInTheDocument()
    expect(screen.getByText('Extracted keyword of "average temp".')).toBeInTheDocument()
    expect(screen.queryByText('Analyzing your query...')).not.toBeInTheDocument()
  })

  test('uses POINT spatial output when NLP returns a point geometry', async () => {
    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'find point',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    await act(async () => {
      capturedUseCompletionOptions.onFinish?.(
        'find point',
        'Final result:\n{"query":"find point","spatialArea":"POINT (-77.0163 38.883)", "temporal":{}}'
      )
    })

    await waitFor(() => {
      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        keyword: 'find point',
        temporal: {},
        spatial: {
          point: ['-77.0163,38.883']
        }
      },
      selectedRegion: {}
    })
  })

  test('stops streaming state when complete throws before onError fires', async () => {
    mockComplete.mockImplementation(async () => {
      throw new Error('network down')
    })

    const { props } = setup({
      overrideProps: {
        activePrompt: 'throw this',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledTimes(2)
    })

    expect(props.onStreamingChange).toHaveBeenNthCalledWith(2, false)
    expect(props.onNlpSearchFailed).toHaveBeenCalledTimes(1)
    expect(props.onNlpSearchFailed).toHaveBeenCalledWith()
  })

  test('calls stop on unmount to prevent duplicate active streams', () => {
    const { unmount } = setup()

    unmount()

    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledWith()
  })

  test('falls back to empty spatial object when WKT parsing fails', async () => {
    vi.spyOn(WKT.prototype, 'readGeometry').mockImplementationOnce(() => {
      throw new Error('Invalid WKT issue')
    })

    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'invalid area',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    await act(async () => {
      capturedUseCompletionOptions.onFinish?.(
        'invalid area',
        'Final result:\n{"query":"invalid area","spatialArea":"POLYGON ((broken))", "temporal":{}}'
      )
    })

    await waitFor(() => {
      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        keyword: 'invalid area',
        temporal: {},
        spatial: {}
      },
      selectedRegion: {}
    })
  })

  test('ignores null spatialArea and temporal fields in NLP final result', async () => {
    const { props, zustandState } = setup({
      overrideProps: {
        activePrompt: 'rainfall',
        requestId: 1
      }
    })

    await waitFor(() => {
      expect(props.onStreamingChange).toHaveBeenCalledTimes(1)
    })

    expect(props.onStreamingChange).toHaveBeenCalledWith(true)

    await act(async () => {
      capturedUseCompletionOptions.onFinish?.(
        'rainfall',
        'Final result:\n{"keyword":"rainfall","query":"rainfall","spatial":null,"spatialArea":null,"temporal":null}'
      )
    })

    await waitFor(() => {
      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        keyword: 'rainfall',
        temporal: {},
        spatial: {}
      },
      selectedRegion: {}
    })

    expect(props.onNlpSearchComplete).toHaveBeenCalledTimes(1)
    expect(props.onNlpSearchComplete).toHaveBeenCalledWith({ hasSpatial: false })
  })

  test('passes parsed prompt and fetch options to NLP request stream', async () => {
    setup()

    const abortController = new AbortController()

    await capturedUseCompletionOptions.fetch?.(
      '/nlp',
      {
        body: JSON.stringify({ prompt: 'rainfall in dc' }),
        headers: {
          'x-test-header': '1'
        },
        credentials: 'include',
        signal: abortController.signal
      }
    )

    expect(mockNlpRequestStream).toHaveBeenCalledTimes(1)
    expect(mockNlpRequestStream).toHaveBeenCalledWith('rainfall in dc', {
      headers: {
        'x-test-header': '1'
      },
      credentials: 'include',
      signal: abortController.signal
    })
  })
})
