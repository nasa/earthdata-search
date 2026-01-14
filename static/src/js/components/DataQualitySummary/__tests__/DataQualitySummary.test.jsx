import React from 'react'
import SanitizedHTML from 'react-sanitized-html'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import DataQualitySummary from '../DataQualitySummary'

jest.mock('react-sanitized-html', () => jest.fn(() => null))

const setup = setupTest({
  Component: DataQualitySummary,
  defaultProps: {
    dataQualitySummaries: [],
    dataQualityHeader: 'Important data quality information'
  }
})

describe('DataQualitySummary component', () => {
  test('does not render without summaries', () => {
    const { container } = setup()

    expect(container.innerHTML).toBe('')
  })

  test('renders a sanatized summary', () => {
    setup({
      overrideProps: {
        dataQualitySummaries: [{
          summary: 'I am a summary'
        }]
      }
    })

    expect(SanitizedHTML).toHaveBeenCalledTimes(1)
    expect(SanitizedHTML).toHaveBeenCalledWith({
      allowedTags: ['br', 'span', 'a', 'p'],
      html: 'I am a summary'
    }, {})
  })

  test('renders a duplicate collection notice', () => {
    setup({
      overrideProps: {
        dataQualityHeader: 'Important data availability information',
        dataQualitySummaries: [{
          id: 'duplicate-collection',
          summary: <>I am a duplicate collection notice</>
        }]
      }
    })

    expect(screen.getByText('Important data availability information')).toBeInTheDocument()
    expect(screen.getByText('I am a duplicate collection notice')).toBeInTheDocument()
  })
})
