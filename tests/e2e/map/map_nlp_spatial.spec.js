import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { createNlpHandlers, nlp } from '../../support/nlpHandlers'
import { createNlpMockStreamChunks } from '../../support/nlpStreamMock'

import commonBody from '../paths/home/__mocks__/common.body.json'
import commonHeaders from '../paths/home/__mocks__/common.headers.json'
import keywordTemporalCollections from '../paths/home/__mocks__/keyword-temporal-collections.body.json'

const screenshotClip = {
  x: 950,
  y: 90,
  width: 405,
  height: 640
}

test.describe('Map: NLP spatial rendering', () => {
  let nlpHandlers

  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      context,
      page
    })

    nlpHandlers = createNlpHandlers({ page })
    nlpHandlers.nlp.use(
      nlp.get('/nlp', () => nlp.stream({
        delayMs: 200,
        chunks: createNlpMockStreamChunks({
          prompt: 'average temp in western montana last april'
        })
      }))
    )

    await nlpHandlers.nlp.start()

    await interceptUnauthenticatedCollections({
      page,
      body: commonBody,
      headers: commonHeaders,
      additionalRequests: [{
        body: keywordTemporalCollections,
        headers: {
          ...commonHeaders,
          'cmr-hits': '805'
        },
        paramCheck: (parsedQuery) => parsedQuery?.keyword === 'average* temp*'
          && parsedQuery?.temporal === '2026-04-01T00:00:00.000Z,2026-04-30T23:59:59.999Z'
          && parsedQuery?.bounding_box?.[0] === '-116.05,44.35821,-109.64514,49.00139'
      }]
    })

    await page.goto('/')
  })

  test.afterEach(async () => {
    await nlpHandlers.nlp.stop()
  })

  test('applies NLP spatial output and recenters the map view @screenshot', async ({ page }) => {
    await page.getByPlaceholder('Wildfires in California during summer 2023').fill('average temp in western montana last april')

    const mapTilesPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\/5/)

    await page.getByRole('button', {
      name: 'Search',
      exact: true
    }).click()

    await expect.poll(
      () => nlpHandlers.nlp.getRequestedPrompts().at(-1)
    ).toBe('average temp in western montana last april')

    await mapTilesPromise

    await expect(page.getByText('Showing 20 of 805 matching collections')).toBeVisible()

    await expect(page).toHaveScreenshot('nlp-spatial-drawn.png', {
      clip: screenshotClip
    })
  })
})
