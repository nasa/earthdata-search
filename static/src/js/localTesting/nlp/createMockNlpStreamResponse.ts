// @ts-expect-error: Types do not exist for this file
import { createNlpMockStreamChunks } from '../../../../../sharedConstants/nlpMockStream'

const MOCK_CHUNK_DELAY_MS = 3800

export const createMockNlpStreamResponse = (prompt: string) => {
  const encoder = new TextEncoder()
  const chunks = createNlpMockStreamChunks({ prompt })

  const stream = new ReadableStream({
    start(controller) {
      let chunkIndex = 0

      const pushChunk = () => {
        if (chunkIndex >= chunks.length) {
          controller.close()

          return
        }

        controller.enqueue(encoder.encode(chunks[chunkIndex]))
        chunkIndex += 1
        setTimeout(pushChunk, MOCK_CHUNK_DELAY_MS)
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