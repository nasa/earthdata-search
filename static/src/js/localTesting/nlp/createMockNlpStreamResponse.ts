// @ts-expect-error: Types do not exist for this file
import { createNlpMockStreamChunks } from '../../../../../sharedConstants/nlpMockStream'

const MOCK_CHUNK_DELAY_MS = 1800

export const createMockNlpStreamResponse = (prompt: string, signal?: AbortSignal) => {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'))
  }

  const encoder = new TextEncoder()
  const chunks = createNlpMockStreamChunks({ prompt })

  const stream = new ReadableStream({
    start(controller) {
      let chunkIndex = 0
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      let streamClosed = false

      const onAbort = () => {
        if (streamClosed) return

        streamClosed = true

        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        if (signal) signal.removeEventListener('abort', onAbort)

        controller.error(new DOMException('The operation was aborted.', 'AbortError'))
      }

      const cleanupAbortListener = () => {
        if (signal) signal.removeEventListener('abort', onAbort)
      }

      const clearPendingTimeout = () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }

      if (signal) signal.addEventListener('abort', onAbort)

      const pushChunk = () => {
        if (signal?.aborted) {
          onAbort()

          return
        }

        if (chunkIndex >= chunks.length) {
          streamClosed = true
          clearPendingTimeout()
          cleanupAbortListener()
          controller.close()

          return
        }

        controller.enqueue(encoder.encode(chunks[chunkIndex]))
        chunkIndex += 1
        timeoutId = setTimeout(pushChunk, MOCK_CHUNK_DELAY_MS)
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
