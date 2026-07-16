import { createServer } from 'node:http'
import { DEFAULT_NLP_MOCK_STREAM_CHUNKS } from '../../sharedConstants/nlpMockStream'

const DEFAULT_CHUNKS = DEFAULT_NLP_MOCK_STREAM_CHUNKS

const createCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  Vary: 'Origin'
})

export const createNlpStreamMock = ({
  chunkDelayMs = 1200,
  chunks = DEFAULT_CHUNKS,
  origin = 'http://localhost:8080',
  page
}) => {
  let server
  let serverBaseUrl = ''
  let requestedPrompts = []
  let currentChunkDelayMs = chunkDelayMs
  let currentChunks = [...chunks]

  const start = async () => {
    requestedPrompts = []

    server = createServer((req, res) => {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1')

      if (requestUrl.pathname !== '/nlp') {
        res.writeHead(404)
        res.end('Not found')

        return
      }

      const corsHeaders = createCorsHeaders(origin)

      if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders)
        res.end()

        return
      }

      const prompt = requestUrl.searchParams.get('query') || ''
      requestedPrompts.push(prompt)

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
        ...corsHeaders
      })

      res.flushHeaders()
      if (res.socket) res.socket.setNoDelay(true)

      let index = 0
      let timeoutId
      const pushChunk = () => {
        if (index >= currentChunks.length) {
          res.end()

          return
        }

        if (res.writableEnded || res.destroyed) return

        res.write(currentChunks[index])
        index += 1
        timeoutId = setTimeout(pushChunk, currentChunkDelayMs)
      }

      res.on('close', () => {
        if (timeoutId) clearTimeout(timeoutId)
      })

      pushChunk()
    })

    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve)
    })

    const address = server.address()
    serverBaseUrl = `http://127.0.0.1:${address.port}`

    await page.route('**/nlp?query=*', async (route) => {
      const requestUrl = new URL(route.request().url())
      await route.continue({
        url: `${serverBaseUrl}/nlp${requestUrl.search}`
      })
    })
  }

  const stop = async () => {
    try {
      await page.unroute('**/nlp?query=*')
    } catch {
      // Ignore teardown errors when the page/context has already closed.
    }

    if (server) {
      await new Promise((resolve) => {
        server.close(resolve)
      })

      server = undefined
    }
  }

  const setChunks = (nextChunks) => {
    currentChunks = [...nextChunks]
  }

  const setChunkDelayMs = (nextChunkDelayMs) => {
    currentChunkDelayMs = nextChunkDelayMs
  }

  const getRequestedPrompts = () => [...requestedPrompts]

  return {
    getRequestedPrompts,
    setChunkDelayMs,
    setChunks,
    start,
    stop
  }
}
