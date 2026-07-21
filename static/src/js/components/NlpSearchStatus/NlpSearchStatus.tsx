import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useCompletion } from '@ai-sdk/react'
import { bbox as turfbox } from '@turf/turf'
import GeoJSON from 'ol/format/GeoJSON'
import WKT from 'ol/format/WKT'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
// @ts-expect-error: Types do not exist for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'

import './NlpSearchStatus.scss'

export const FINAL_RESULT_MARKER = 'Final result:'

type NlpSearchStatusProps = {
    activePrompt?: string
    requestId?: number
    onStreamingChange?: (isStreaming: boolean) => void
    onNlpSearchComplete?: () => void | Promise<void>
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
    const geoJsonGeometry = new GeoJSON().writeGeometryObject(geometry)
    const [minLongitude, minLatitude, maxLongitude, maxLatitude] = turfbox(geoJsonGeometry)

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

  // Supress raw error lines from /nlp
  // They are handled by the error callback, not displayed as steps
  if (/^error:/i.test(normalizedLine)) return ''

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

  const [statusSteps, setStatusSteps] = useState<string[]>([])

  const appendStatusStep = useCallback((nextStep: string) => {
    if (!nextStep) return

    setStatusSteps((previousSteps) => {
      if (previousSteps[previousSteps.length - 1] === nextStep) return previousSteps

      return [...previousSteps, nextStep]
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

      appendStatusStep('Building final query...')

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

      setCollectionId(null)
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
      await Promise.resolve(onNlpSearchComplete())
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
    if (!isNlpLoading) return

    const parsedSteps = extractProgressSteps(completion)
    if (parsedSteps.length === 0) return

    setStatusSteps((previousSteps) => {
      const nextSteps = previousSteps.filter((step) => step !== 'Analyzing your query...')

      parsedSteps.forEach((step) => {
        if (!nextSteps.includes(step)) nextSteps.push(step)
      })

      return nextSteps
    })
  }, [completion, isNlpLoading])

  const runPrompt = useCallback(async (prompt: string, nextRequestId: number) => {
    if (!prompt || isNlpLoading) return

    lastStartedRequestIdRef.current = nextRequestId
    setCompletion('')
    setStatusSteps(['Analyzing your query...'])

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
  }, [complete, isNlpLoading, onNlpSearchFailed, onStreamingChange, setCompletion])

  useEffect(() => () => {
    // Prevent duplicate active streams during dev Strict Mode remounts.
    if (typeof stop === 'function') stop()
  }, [])

  useEffect(() => {
    const trimmedPrompt = activePrompt.trim()
    if (!requestId || !trimmedPrompt) return

    if (lastStartedRequestIdRef.current === requestId) return

    runPrompt(trimmedPrompt, requestId)
  }, [activePrompt, requestId, runPrompt])

  const latestStatusStep = statusSteps[statusSteps.length - 1] || ''

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
                    className="nlp-search-chat__steps"
                    aria-label="Search query parsing updates"
                  >
                    {
                      statusSteps.map((step, index) => {
                        const key = `${step}-${index}`
                        const isLatest = step === latestStatusStep
                          && index === statusSteps.length - 1

                        return (
                          <li
                            key={key}
                            className={
                              ['nlp-search-chat__step',
                                isLatest ? 'nlp-search-chat__step--latest' : ''
                              ].filter(Boolean).join(' ')
                            }
                          >
                            {step}
                          </li>
                        )
                      })
                    }
                  </ul>
                )
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default NlpSearchStatus
