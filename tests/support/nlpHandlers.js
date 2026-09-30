import { createNlpStreamMock } from './nlpStreamMock'

const DEFAULT_DELAY_MS = 1200

export const nlp = {
  get: (path, resolver) => ({
    method: 'GET',
    path,
    resolver
  }),
  stream: ({
    chunks,
    delayMs = DEFAULT_DELAY_MS
  }) => ({
    type: 'stream',
    chunks,
    delayMs
  })
}

export const createNlpHandlers = ({ page }) => {
  const streamMock = createNlpStreamMock({ page })

  const use = (handler) => {
    if (!handler || handler.method !== 'GET' || handler.path !== '/nlp') {
      throw new Error('Only nlp.get("/nlp", ...) handlers are supported')
    }

    const config = handler.resolver?.({})

    if (!config || config.type !== 'stream') {
      throw new Error('nlp.get("/nlp", ...) must return nlp.stream({...})')
    }

    if (Array.isArray(config.chunks)) {
      streamMock.setChunks(config.chunks)
    }

    if (typeof config.delayMs === 'number') {
      streamMock.setChunkDelayMs(config.delayMs)
    }
  }

  return {
    nlp: {
      getRequestedPrompts: () => streamMock.getRequestedPrompts(),
      start: () => streamMock.start(),
      stop: () => streamMock.stop(),
      use
    }
  }
}
