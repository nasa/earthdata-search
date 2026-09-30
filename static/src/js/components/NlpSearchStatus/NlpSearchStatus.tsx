import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useCompletion } from '@ai-sdk/react'
import WKT from 'ol/format/WKT'
import {
  ArrowChevronDown,
  ArrowChevronUp
  // @ts-expect-error: Types do not exist for this file
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import Spinner from '../Spinner/Spinner'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
// @ts-expect-error: Types do not exist for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'

import './NlpSearchStatus.scss'

export const FINAL_RESULT_MARKER = 'Final result:'

/**
 * Props accepted by the NlpSearchStatus component.
 */
type NlpSearchStatusProps = {
  /** Active prompt being parsed. */
    activePrompt?: string
  /** Request id used to prevent duplicate runs. */
    requestId?: number
  /** Notifies the parent when NLP streaming starts or stops. */
    onStreamingChange?: (isStreaming: boolean) => void
  /** Called after NLP parsing completes and query updates are applied. */
    onNlpSearchComplete?: (options: { hasSpatial: boolean }) => void | Promise<void>
  /** Called when NLP parsing or streaming fails. */
    onNlpSearchFailed?: () => void
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

  const roundCoordinate = (value: number) => Number(value.toFixed(5))

  const pointMatch = spatialArea.match(/^POINT\s*\((.*)\)$/i)
  if (pointMatch?.[1]) {
    const pointString = pointMatch[1].trim().split(/\s+/).join(',')

    return {
      point: [pointString]
    }
  }

  try {
    const geometry = new WKT().readGeometry(spatialArea)
    const [minLongitude, minLatitude, maxLongitude, maxLatitude] = geometry.getExtent()

    const boundingBox = [
      roundCoordinate(minLongitude),
      roundCoordinate(minLatitude),
      roundCoordinate(maxLongitude),
      roundCoordinate(maxLatitude)
    ].join(',')

    return {
      boundingBox: [boundingBox]
    }
  } catch {
    return {}
  }
}

const toProgressStep = (line: string) => {
  const normalizedLine = line.replace(/^[-*]\s*/, '').trim()
  if (!normalizedLine) return ''

  // Suppress raw error lines from /nlp
  if (/^error:/i.test(normalizedLine)) return ''

  // Ignore the "Analyzing" string coming from the Lambda stream
  if (/^Analyzing your query/i.test(normalizedLine)) return ''

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
  onStreamingChange = () => {},
  onNlpSearchComplete = () => {},
  onNlpSearchFailed = () => {}
}) => {
  const lastStartedRequestIdRef = useRef<number | null>(null)
  const completionTextRef = useRef('')

  const [statusSteps, setStatusSteps] = useState<string[]>([])
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const appendStatusStep = useCallback((nextStep: string) => {
    if (!nextStep) return

    setStatusSteps((previousSteps) => {
      if (previousSteps[previousSteps.length - 1] === nextStep) return previousSteps

      return [...previousSteps, nextStep]
    })
  }, [])

  const applyIntermediateSteps = useCallback((completionText: string) => {
    const parsedSteps = extractProgressSteps(completionText)
    if (parsedSteps.length === 0) return

    setStatusSteps((previousSteps) => {
      const nextSteps = previousSteps.filter((step) => step !== 'Analyzing your query...')

      parsedSteps.forEach((step) => {
        if (!nextSteps.includes(step)) nextSteps.push(step)
      })

      return nextSteps
    })
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
      // Ignore stale completions for a request that has been cancelled.
      if (lastStartedRequestIdRef.current == null) return

      const parsedResult = parsedNlpFinalResult(completionText)

      if (!parsedResult) {
        handleError({
          error: new Error('Could not parse server response of query results'),
          action: 'parseNlpResponse',
          resource: 'nlpSearch',
          showAlertButton: true,
          title: 'Something went wrong parsing query'
        })

        appendStatusStep('Unable to parse final result')
        onStreamingChange(false)
        onNlpSearchFailed()

        return
      }

      const {
        keyword,
        temporal,
        spatialArea
      } = parsedResult

      const spatial = parseWktSpatial(spatialArea)
      const hasSpatial = Object.keys(spatial).length > 0

      // Clear any previously focused collection/granule detail state so
      // landing-page NLP searches always continue from a clean Search context.
      setCollectionId(null)

      // Step appended right as the network request for collections begins,
      // potentially giving the user time to read the extracted values.
      appendStatusStep('Retrieving collections')

      changeQuery({
        collection: {
          keyword: keyword || prompt,
          temporal: temporal || {},
          spatial
        },
        selectedRegion: {}
      })

      // Trigger navigation flow in Home after collections retrieval finishes.
      await Promise.resolve(onNlpSearchComplete({ hasSpatial }))
    },
    onError: (error) => {
      // Ignore stale errors for a request that has been cancelled.
      if (lastStartedRequestIdRef.current == null) return

      handleError({
        error,
        action: 'fetchNlpSearch',
        resource: 'nlpSearch',
        showAlertButton: true,
        title: 'Something went wrong fetching query search results'
      })

      lastStartedRequestIdRef.current = null
      onStreamingChange(false)
      onNlpSearchFailed()
    }
  })

  useEffect(() => {
    completionTextRef.current = completion
  }, [completion])

  useEffect(() => {
    applyIntermediateSteps(completion)
  }, [applyIntermediateSteps, completion])

  const runPrompt = useCallback(async (prompt: string, nextRequestId: number) => {
    if (!prompt || isNlpLoading) return

    lastStartedRequestIdRef.current = nextRequestId
    setCompletion('')
    setStatusSteps(['Analyzing your query...'])
    setIsHistoryExpanded(false)
    onStreamingChange(true)

    try {
      await complete(prompt)
    } catch {
      // Safety because complete() can throw when onError doesn't fire
      // due to network error. Reset only if request is active
      if (lastStartedRequestIdRef.current != null) {
        lastStartedRequestIdRef.current = null
        onStreamingChange(false)
        onNlpSearchFailed()
      }
    }
  }, [
    complete,
    isNlpLoading,
    onNlpSearchFailed,
    onStreamingChange,
    setCompletion
  ])

  useEffect(() => () => {
    // Prevent duplicate active streams during dev Strict Mode remounts.
    if (typeof stop === 'function') stop()
  }, [stop])

  useEffect(() => {
    const trimmedPrompt = activePrompt.trim()
    if (!requestId || !trimmedPrompt) return

    if (lastStartedRequestIdRef.current === requestId) return

    runPrompt(trimmedPrompt, requestId)
  }, [activePrompt, requestId, runPrompt])

  const latestStatusStep = statusSteps[statusSteps.length - 1] || ''
  const previousStatusSteps = statusSteps.slice(0, -1)
  const hasPreviousStatusSteps = previousStatusSteps.length > 0

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
            {
              statusSteps.length === 0
                ? (
                  <p className="nlp-search-chat__step nlp-search-chat__step--muted">
                    Waiting for Query parsing status updates
                  </p>
                )
                : (
                  <ul
                    id="nlp-search-chat-history"
                    className="nlp-search-chat__steps"
                    aria-label="Search query parsing updates"
                  >
                    {
                      isHistoryExpanded && previousStatusSteps.map((step) => (
                        <li key={step} className="nlp-search-chat__step">
                          {step}
                        </li>
                      ))
                    }
                    <li className="nlp-search-chat__step nlp-search-chat__step--latest">
                      {latestStatusStep}
                    </li>
                  </ul>
                )
            }
          </div>
          {
            hasPreviousStatusSteps && (
              <button
                className="nlp-search-chat__history-toggle"
                type="button"
                aria-controls="nlp-search-chat-history"
                aria-expanded={isHistoryExpanded}
                aria-label={isHistoryExpanded ? 'Hide previous search updates' : 'Show previous Search updates'}
                onClick={() => setIsHistoryExpanded((isExpanded) => (!isExpanded))}
              >
                <EDSCIcon icon={isHistoryExpanded ? ArrowChevronUp : ArrowChevronDown} size="16" />
              </button>
            )
          }
        </div>
      </div>
    </section>
  )
}

export default NlpSearchStatus
