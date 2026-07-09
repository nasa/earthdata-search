import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { useCompletion } from '@ai-sdk/react'

import useEdscStore from '../../zustand/useEdscStore'

import './NlpSearchChat.scss'

type NlpSearchChatProps = {
    activePrompt?: string
    requestId?: number
    onStreamingChange?: (isStreaming: boolean) => void
    onNlpSearchComplete?: () => void
}

const FINAL_RESULT_MARKER = 'Final result:'
const USE_MOCK_NLP_STREAM = true

const createMockNlpStreamResponse = (prompt: string) => {
    const encoder = new TextEncoder()
    const effectivePrompt = prompt || 'average temp in western montana last april'

    const finalResult = {
        keyword: 'average temp',
        query: effectivePrompt,
        spatial: 'western montana',
        spatialArea: "POLYGON((-116.050002 44.358209, -109.64514022973341 44.358209, -109.64514022973341 49.00139, -116.050002 49.00139, -116.050002 44.358209))",
        temporal: {"startDate":"2026-04-01T00:00:00.000Z","endDate":"2026-04-30T23:59:59.999Z"}
}

    const chunks = [
        'analyzing your query...\n',
        'Found temporal of "last april".\n',
        'Found keyword of "average temp"\n',
        `${FINAL_RESULT_MARKER}\n${JSON.stringify(finalResult)}`
    ]

    const stream = new ReadableStream({
        start(controller) {
            let chunkIndex = 0

            const pushChunk = () => {
                if (chunkIndex >+ chunks.length) {
                    controller.close()

                    return
                }

                controller.enqueue(encoder.encode(chunks[chunkIndex]))
                chunkIndex += 1
                setTimeout(pushChunk, 350)
            }

            pushChunk()
        }
    })

    return Promise.resolve(new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        },
        status: 200
    }))
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
        const polygonString =polygonMatch[1]
            .split(',')
            .map((pair) => pair.trim().split(/\s+/).join(','))
            .join(',')

        return {
            polygon: [polygonString]
        }
    }

    const pointMatch = spatialArea.match(/^POINT\s*\((.*)\)$/i)
     if (pointMatch?.[1]) {
        const pointString =pointMatch[1].trim().split(/\s+/).join(',')

        return {
            point: [pointString]
        }
    }

    return {}
}

const NLPSearchChat: React.FC<NlpSearchChatProps> = ({
  activePrompt = '',
  requestId,
  onStreamingChange = () => {},
  onNlpSearchComplete = () => {}
}) => {
    const activeNlpAssistenatMessageIdRef = useRef<string | null>(null)
    const latestNlpPromptRef = useRef('')
    const nlpMessageIdRef = useRef(0)

    const [nlpMessages, setNlpMessages] = useState<Array<{
        id: string
        role: 'user' | 'assistant'
        text: string
        isStreaming: boolean
    }>>([])

    const {
        setCollectionId,
        changeQuery,
        handleError
    } = useEdscStore((state) => ({
        setCollectionId: state.collection.setCollectionId,
        changeQuery: state.query.changeQuery,
        handleError: state.errors.handleError
    }))

    const {
        complete,
        completion,
        isLoading: isNlpLoading,
        setCompletion,
        error: nlpError
    } = useCompletion({
        api: '/nlp',
        streamProtocol: 'text',
        fetch: (_, init) => {
            let prompt = ''

            if (init?.body) {
                const body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body
                prompt = body?.prompt || ''
            }

            const query = encodeURIComponent(prompt)

            if(USE_MOCK_NLP_STREAM) return createMockNlpStreamResponse(prompt)

            return fetch (`/nlp?query=${query}`, {
                method: 'GET',
                headers: init?.headers,
                credentials: init?.credentials,
                signal: init?.signal
            })
        },
        onFinish: (prompt, completionText) => {
            const assistantText = getNLPDisplayText(completionText)

            setNlpMessages((prevMessages) => prevMessages.map((message) => {
                if (message.id !== activeNlpAssistenatMessageIdRef.current) return message

                return {
                    ...message,
                    text: assistantText || 'Search instructions received.',
                    isStreaming: false
                }
            }))

            const parsedResult = parsedNlpFinalResult(completionText)

            if(!parsedResult) {
                handleError({
                    error: new Error("Could not parse NLP response result"),
                    action: 'parseNlpResponse',
                    resource: 'nlpSearch',
                    showAlertButton: true,
                    title: 'Something went wrong parsing NLP search results'
                })

                onStreamingChange(false)
                activeNlpAssistenatMessageIdRef.current = null

                return
            }

            const {
              keyword,
              temporal,
              spatialArea
            } = parsedResult

            const spatial = parseWktSpatial(spatialArea)

            setCollectionId(null)
            changeQuery({
                collection: {
                    keyword: keyword || prompt || latestNlpPromptRef.current,
                    temporal: temporal || {},
                    spatial
                },
                selectedRegion: {}
            })

            onStreamingChange(false)
            onNlpSearchComplete()
            activeNlpAssistenatMessageIdRef.current = null
        },
        onError: (error) => {
            setNlpMessages((prevMessages) => prevMessages.map((message) => {
                if(message.id !== activeNlpAssistenatMessageIdRef.current) return message

                return {
                    ...message,
                    text: 'NLP search failed. Please try again',
                    isStreaming: false
                }
            }))
        
            handleError({
                error,
                action: 'fetchNlpSearch',
                resource: 'nlpSearch',
                showAlertButton: true,
                title: 'Something went wrong fetching NLP search results'
            })
        
            onStreamingChange(false)
            activeNlpAssistenatMessageIdRef.current = null
        }
      })

      useEffect(() => {
        if (!activeNlpAssistenatMessageIdRef.current) return

        const assistantText = getNLPDisplayText(completion)

        setNlpMessages((prevMessages) => prevMessages.map((message) => {
            if (message.id !== activeNlpAssistenatMessageIdRef.current) return message

            return {
                ... message,
                text: assistantText || 'Analyzing your query...',
                isStreaming: isNlpLoading
            }
        }))
      }, [completion, isNlpLoading])

      const runPrompt = useCallback(async (prompt: string) => {
        if (!prompt || isNlpLoading) return

        nlpMessageIdRef.current += 1
        const userMessageId = `nlp-user-${nlpMessageIdRef.current}`

        nlpMessageIdRef.current += 1
        const assistantMessageId = `nlp-assistant-${nlpMessageIdRef.current}`

        setCompletion('')
        latestNlpPromptRef.current = prompt
        activeNlpAssistenatMessageIdRef.current = assistantMessageId

        setNlpMessages((prevMessages) => [
            ...prevMessages,
            {
                id: userMessageId,
                role: 'user',
                text: prompt,
                isStreaming: false
            },
            {
                id: assistantMessageId,
                role: 'assistant',
                text: 'Analysing your query...',
                isStreaming: true
            }
        ])

        onStreamingChange(true)

        await complete(prompt)
      }, [complete, isNlpLoading, onStreamingChange, setCompletion])
    
    useEffect(() => {
        const trimmedPrompt = activePrompt.trim()
        if(!requestId || !trimmedPrompt) return

        runPrompt(trimmedPrompt)
    }, [activePrompt, requestId, runPrompt])

    return (
        <section className='nlp-search-chat'>
            <div className='nlp-search-chat__messages'>
                {
                    nlpMessages.length === 0 && (
                        <div className="nlp-search-chat_empty">
                          Ask in plain language and I will translate it intos earch filters
                        </div>
                    )
                }
                {
                  nlpMessages.map((message) => (
                    <div
                        key={message.id}
                        className={`nlp-search-chat__message nlp-search-chat__message--${message.role}`}
                    >
                        <div className="nlp-search-chat__bubble">
                          {message.text}
                          {
                            message.isStreaming && (
                                <span className='nlp-search-chat__streaming'>...</span>
                            )
                          }
                        </div>
                    </div>
                 ))
                }
                {
                    nlpError && (
                        <div className=" nlp-search-chat__error">
                            NLP search failed. Please try again.
                        </div>
                    )
                }
            </div>

            {
              isNlpLoading && (
                <div className="nlp-search-chat__status">
                    Streaming response...
                </div>
              )
            }
        </section>
    )
}

export default NLPSearchChat