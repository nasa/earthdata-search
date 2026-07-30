import { test, expect } from 'playwright-test-coverage'

import { setupTests } from '../../support/setupTests'
import {
  interceptUnauthenticatedCollections
} from '../../support/interceptUnauthenticatedCollections'
import { createNlpHandlers, nlp } from '../../support/nlpHandlers'
import { createNlpMockStreamChunks } from '../../support/nlpStreamMock'

import commonBody from '../paths/home/__mocks__/common.body.json'
import commonHeaders from '../paths/home/__mocks__/common.headers.json'

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
      headers: commonHeaders
    })

    await page.goto('/')
  })

  test.afterEach(async () => {
    await nlpHandlers.nlp.stop()
  })

  test('applies NLP spatial output and recenters the map view', async ({ page }) => {
    await page.getByPlaceholder('Wildfires in California during summer 2023').fill('average temp in western montana last april')

    await page.getByRole('button', {
      name: 'Search',
      exact: true
    }).click()

    await expect.poll(
      () => nlpHandlers.nlp.getRequestedPrompts().at(-1)
    ).toBe('average temp in western montana last april')

    await expect(page).toHaveURL(/\/?q=average(?:%20|\+)temp/, { timeout: 30000 })

    await expect(page).toHaveURL(/qt=2026-04-01T00%3A00%3A00\.000Z%2C2026-04-30T23%3A59%3A59\.999Z/, { timeout: 15000 })
    await expect(page).toHaveURL(/sb\[0\]=-116\.05%2C44\.35821%2C-109\.64514%2C49\.00139/, { timeout: 15000 })

    const mapTilesPromise = page.waitForResponse(/World_Imagery\/MapServer\/tile\//)

    await page.getByRole('button', { name: 'Browse all Earth Science Data' }).click()

    await mapTilesPromise

    await expect(page).toHaveURL(/\/search\?q=average(?:%20|\+)temp/, { timeout: 15000 })
    await expect(page).toHaveURL(/qt=2026-04-01T00%3A00%3A00\.000Z%2C2026-04-30T23%3A59%3A59\.999Z/, { timeout: 15000 })
    await expect(page).toHaveURL(/sb\[0\]=-116\.05%2C44\.35821%2C-109\.64514%2C49\.00139/, { timeout: 15000 })
    await expect(page).toHaveURL(/lat=|long=|zoom=/, { timeout: 15000 })
  })
})
