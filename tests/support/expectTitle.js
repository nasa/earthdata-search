import { expect } from 'playwright-test-coverage'

/**
 * Asserts that the current page title matches the provided value, allowing for
 * optional environment prefixes used in non-prod deployments.
 * @param {import('@playwright/test').Page} page Playwright page instance
 * @param {string} title Expected title without environment prefix
 */
export const expectTitle = async (page, title) => {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  await expect(page).toHaveTitle(new RegExp(`(?:\\[[A-Z]+\\] )?${escaped}$`))
}
