export const FINAL_RESULT_MARKER = 'Final result:'

export const DEFAULT_NLP_MOCK_PROMPT = 'average temp in western montana last april'

const DEFAULT_NLP_MOCK_PROGRESS_LINES = [
  'Found spatial of "western montana".',
  'Found temporal of "last april".',
  'Found keyword of "average temp".'
]

const DEFAULT_NLP_MOCK_RESULT = {
  keyword: 'average temp',
  spatial: 'western montana',
  spatialArea: 'POLYGON((-116.050002 44.358209, -109.64514022973341 44.358209, -109.64514022973341 49.00139, -116.050002 49.00139, -116.050002 44.358209))',
  temporal: {
    startDate: '2026-04-01T00:00:00.000Z',
    endDate: '2026-04-30T23:59:59.999Z'
  }
}

export const createNlpMockFinalResult = (prompt = DEFAULT_NLP_MOCK_PROMPT) => ({
  ...DEFAULT_NLP_MOCK_RESULT,
  query: prompt || DEFAULT_NLP_MOCK_PROMPT
})

export const createNlpMockStreamChunks = ({
  prompt = DEFAULT_NLP_MOCK_PROMPT,
  progressLines = DEFAULT_NLP_MOCK_PROGRESS_LINES
} = {}) => {
  const chunks = []

  if (Array.isArray(progressLines) && progressLines.length > 0) {
    chunks.push(...progressLines.map((line) => `${line}\n`))
  }

  const resolvedFinalResult = createNlpMockFinalResult(prompt)

  chunks.push(
    `${FINAL_RESULT_MARKER}\n`,
    JSON.stringify(resolvedFinalResult)
  )

  return chunks
}

export const DEFAULT_NLP_MOCK_STREAM_CHUNKS = createNlpMockStreamChunks()
