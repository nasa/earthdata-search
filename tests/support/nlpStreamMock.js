import { createServer } from 'node:http'

const DEFAULT_CHUNKS = [
  'Found spatial of "western montana".\n',
  'Found temporal of "last april".\n',
  'Found keyword of "average temp".\n',
  'Final result:\n',
  '{"keyword":"average temp","query":"average temp in Western montana last april","spatial":"Western montana","spatialArea":"POLYGON((-116.050002 44.358209, -116.050002 49.00139, -109.64514022973341 49.00139, -109.64514022973341 44.358209, -116.050002 44.358209))","temporal":{"startDate":"2026-04-01T00:00:00.000Z","endDate":"2026-04-30T23:59:59.999Z"}}'
]

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
