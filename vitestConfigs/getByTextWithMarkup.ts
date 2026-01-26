// https://stackoverflow.com/a/56859650

/**
 * getByTextWithMarkup.ts
 * This file contains a custom query for testing-library/react that allows you to find elements by their text content,
 * even when the text includes HTML markup or other elements.
 *
 * Example:
 * Component code:
 * ```jsx
 * <div>
 *   Some text with <strong>markup</strong>
 * </div>
 * ```
 *
 * Test code:
 * ```jsx
 * import getByTextWithMarkup from 'vitestConfigs/getByTextWithMarkup'
 * const element = getByTextWithMarkup('Some text with markup')
 * expect(element).toBeInTheDocument()
 * ```
 */

import { MatcherFunction, screen } from '@testing-library/react'

type Query = (f: MatcherFunction) => HTMLElement

const withMarkup = (query: Query) => (text: string): HTMLElement => query(
  (_content: string, node: Element | null) => {
    if (!node) return false

    const hasText = (textNode: Element) => textNode.textContent === text

    // eslint-disable-next-line testing-library/no-node-access
    const childrenDontHaveText = Array.from(node.children).every(
      (child) => !hasText(child as Element)
    )

    return hasText(node) && childrenDontHaveText
  }
)

const getByTextWithMarkup = withMarkup(screen.getByText)

export default getByTextWithMarkup
