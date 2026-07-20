import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useCompletion } from '@ai-sdk/react'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
// @ts-expect-error: Types do not exist for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'

// @ts-expect-error: Types do not exist for this file
import { FINAL_RESULT_MARKER } from '../../../../../sharedConstants/nlpMockStream'

import './NlpSearchStatus.scss'

type NlpSearchStatusProps = {
    activePrompt?: string
    requestId?: number
    cancelRequestId?: number
    onStreamingChange?: (isStreaming: boolean) => void
    onNlpSearchComplete?: () => void | Promise<void>
}

const getNLPDisplayText = (completionText: string) => {
  if (!completionText) return ''

  const markerIndex = completionText.lastIndexOf(FINAL_RESULT_MARKER)
  if (markerIndex === -1) return completionText.trim()

  return completionText.slice(0, markerIndex).trim()
}

const parsedNlpFinalResult = (completionText: string) => {
  if (!completionText) return null

  const markerIndex = completionText.lastIndexOf(FINAL_RESULT_MARKER)
  if (markerIndex === -1) return null

  const resultText = completionText.slice(markerIndex + FINAL_RESULT_MARKER.length).trim()
  if (!resultText) return null

  try {
    return JSON.parse(resultText)
  } catch {
    return null
  }
}

const parseWktSpatial = (spatialArea: string | undefined) => {
  if (!spatialArea || typeof spatialArea !== 'string') return {}

  const polygonMatch = spatialArea.match(/^POLYGON\s*\(\((.*)\)\)$/i)
  if (polygonMatch?.[1]) {
    const polygonString = polygonMatch[1]
      .split(',')
      .map((pair) => pair.trim().split(/\s+/).join(','))
      .join(',')

    return {
      polygon: [polygonString]
    }
  }

  const pointMatch = spatialArea.match(/^POINT\s*\((.*)\)$/i)
  if (pointMatch?.[1]) {
    const pointString = pointMatch[1].trim().split(/\s+/).join(',')

    return {
      point: [pointString]
    }
  }

  return {}
}

const toProgressStep = (line: string) => {
  const normalizedLine = line.replace(/^[-*]\s*/, '').trim()
  if (!normalizedLine) return ''

  const temporalMatch = normalizedLine.match(/^Found temporal of (.*)\.?$/i)
  if (temporalMatch?.[1]) return `Extracted temporal range of ${temporalMatch?.[1]}`

  const spatialMatch = normalizedLine.match(/^Found spatial of (.*)\.?$/i)
  if (spatialMatch?.[1]) return `Extracted spatial area of ${spatialMatch?.[1]}`

  const keywordMatch = normalizedLine.match(/^Found keyword of (.*)\.?$/i)
  if (keywordMatch?.[1]) return `Extracted keyword of ${keywordMatch?.[1]}`

  return normalizedLine
}

const extractProgressSteps = (completionText: string) => {
  const displayText = getNLPDisplayText(completionText)
  if (!displayText) return []

  return displayText
    .split('\n')
    .map(toProgressStep)
    .filter(Boolean)
}

const NlpSearchStatus: React.FC<NlpSearchStatusProps> = ({
  activePrompt = '',
  requestId,
  cancelRequestId,
  onStreamingChange = () => {},
  onNlpSearchComplete = () => {}
}) => {
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentStatusStepRef = useRef('')
  const queuedStatusRef = useRef('')
  const lastStartedRequestIdRef = useRef<number | null>(null)
  const lastHandledCancelRequestIdRef = useRef<number>(0)

  const [latestNlpPrompt, setLatestNlpPrompt] = useState('')
  const [displayStatusStep, setDisplayStatusStep] = useState('')
  const [statusTransitionState, setStatusTransitionState] = useState<'idle' | 'fading-out' | 'fading-in'>('idle')

  const setStatusStep = useCallback((nextStep: string) => {
    if (!nextStep) return

    if (
      nextStep === currentStatusStepRef.current
            || nextStep === queuedStatusRef.current
    ) return

    queuedStatusRef.current = nextStep

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    if (!currentStatusStepRef.current) {
      currentStatusStepRef.current = nextStep
      setDisplayStatusStep(nextStep)
      setStatusTransitionState('fading-in')

      transitionTimeoutRef.current = setTimeout(() => {
        setStatusTransitionState('idle')
      }, 180)

      return
    }

    setStatusTransitionState('fading-out')

    transitionTimeoutRef.current = setTimeout(() => {
      currentStatusStepRef.current = queuedStatusRef.current
      setDisplayStatusStep(queuedStatusRef.current)
      queuedStatusRef.current = ''
      setStatusTransitionState('fading-in')

      transitionTimeoutRef.current = setTimeout(() => {
        setStatusTransitionState('idle')
      }, 180)
    }, 150)
  }, [])

  const {
    setCollectionId,
    changeQuery,
    handleError,
    earthdataEnvironment
  } = useEdscStore((state) => ({
    setCollectionId: state.collection.setCollectionId,
    changeQuery: state.query.changeQuery,
    handleError: state.errors.handleError,
    earthdataEnvironment: getEarthdataEnvironment(state)
  }))

  const {
    complete,
    completion,
    isLoading: isNlpLoading,
    setCompletion,
    stop
  } = useCompletion({
    api: '/nlp',
    streamProtocol: 'text',
    fetch: (_, init) => {
      let prompt = ''

      if (init?.body) {
        const body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body
        prompt = body?.prompt || ''
      }

      const requestObject = new NlpSearchRequest(earthdataEnvironment)

      return requestObject.stream(prompt, {
        headers: init?.headers,
        credentials: init?.credentials,
        signal: init?.signal
      })
    },
    onFinish: async (prompt, completionText) => {
      setStatusStep('Building final query...')

      const parsedResult = parsedNlpFinalResult(completionText)

      if (!parsedResult) {
        handleError({
          error: new Error('Could not parse server response of query results'),
          action: 'parseNlpResponse',
          resource: 'nlpSearch',
          showAlertButton: true,
          title: 'Something went wrong parsing query'
        })

        setStatusStep('unable to parse final result')
        onStreamingChange(false)
        queuedStatusRef.current = ''

        return
      }

      const {
        keyword,
        temporal,
        spatialArea
      } = parsedResult

      const spatial = parseWktSpatial(spatialArea)

      setCollectionId(null)
      setStatusStep('Retrieving collections')

      changeQuery({
        collection: {
          keyword: keyword || prompt || latestNlpPrompt,
          temporal: temporal || {},
          spatial
        },
        selectedRegion: {}
      })

      // Trigger navigation flow in Home after collections retrieval finishes.
      await Promise.resolve(onNlpSearchComplete())
    },
    onError: (error) => {
      setStatusStep('Query Search failed. Please try again')

      handleError({
        error,
        action: 'fetchNlpSearch',
        resource: 'nlpSearch',
        showAlertButton: true,
        title: 'Something went wrong fetching NLP search results'
      })

      onStreamingChange(false)
      queuedStatusRef.current = ''
    }
  })

  useEffect(() => {
    if (!isNlpLoading) return

    const parsedSteps = extractProgressSteps(completion)
    if (parsedSteps.length === 0) return

    const latestParsedStep = parsedSteps[parsedSteps.length - 1]
    setStatusStep(latestParsedStep)
  }, [completion, isNlpLoading, setStatusStep])

  const runPrompt = useCallback(async (prompt: string, nextRequestId: number) => {
    if (!prompt || isNlpLoading) return

    lastStartedRequestIdRef.current = nextRequestId
    setCompletion('')
    setLatestNlpPrompt(prompt)
    queuedStatusRef.current = ''
    currentStatusStepRef.current = 'Analyzing your query...'
    setDisplayStatusStep('Analyzing your query...')
    setStatusTransitionState('idle')

    onStreamingChange(true)

    await complete(prompt)
  }, [complete, isNlpLoading, onStreamingChange, setCompletion])

  useEffect(() => () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // Prevent duplicate active streams during dev Strict Mode remounts.
    if (typeof stop === 'function') stop()
  }, [])

  useEffect(() => {
    const trimmedPrompt = activePrompt.trim()
    if (!requestId || !trimmedPrompt) return

    if (lastStartedRequestIdRef.current === requestId) return

    runPrompt(trimmedPrompt, requestId)
  }, [activePrompt, requestId, runPrompt])

  useEffect(() => {
    if (!cancelRequestId || cancelRequestId <= lastHandledCancelRequestIdRef.current) return

    lastHandledCancelRequestIdRef.current = cancelRequestId

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    if (typeof stop === 'function') stop()

    lastStartedRequestIdRef.current = null
    queuedStatusRef.current = ''
    currentStatusStepRef.current = ''
    setDisplayStatusStep('')
    setStatusTransitionState('idle')
    onStreamingChange(false)
  }, [cancelRequestId, onStreamingChange, stop])

  const statusStepLabel = displayStatusStep || 'Waiting for NLP status updates'
  const statusStepClassName = [
    'nlp-search-chat__step',
    displayStatusStep ? 'nlp-search-chat__step--latest' : 'nlp-search-chat__step--muted',
    statusTransitionState === 'fading-out' ? 'nlp-search-chat__step--fading-out' : '',
    statusTransitionState === 'fading-in' ? 'nlp-search-chat__step--fading-in' : ''
  ].filter(Boolean).join(' ')

  return (
    <section className="nlp-search-chat" aria-live="polite">
      <div className="nlp-search-chat__panel" role="status" aria-live="polite">
        <div className="nlp-search-chat__step-row">
          <Spinner
            type="dots"
            inline
            size="tiny"
            className="nlp-search-chat__step-loader"
            label="NLP parsing in progress"
          />
          <div className="nlp-search-chat__step-text-wrap">
            <p className={statusStepClassName}>{statusStepLabel}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NlpSearchStatus
