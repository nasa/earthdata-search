import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import GranuleResultsFocusedMeta from '../GranuleResultsFocusedMeta'

describe('GranuleResultsFocusedMeta component', () => {
  describe('when no links are provided', () => {
    test('should not render', async () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: false,
            links: [],
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when the browse flag is false', () => {
    test('should not render', async () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: false,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when links are provided', () => {
    test('should render', async () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: true,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).toBeInTheDocument()
    })
  })
})
