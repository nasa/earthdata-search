import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import WrappingContainer from '../WrappingContainer'

const setup = setupTest({
  Component: WrappingContainer,
  defaultProps: {
    children: <div data-testid="test-child">Im a child!</div>
  },
  defaultZustandState: {
    location: {
      location: {
        pathname: '/search',
        search: ''
      }
    }
  },
  withRouter: true
})

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('WrappingContainer component', () => {
  test('renders container and the children', async () => {
    setup()

    expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
  })

  describe('when in a route that does not include the map', () => {
    test('does not render classname on saved projects', async () => {
      setup({
        overrideRouterEntries: ['/contact-info']
      })

      expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
    })
  })

  describe('when in a route that includes the map', () => {
    describe('project page', () => {
      test('does not include map classname on saved projects', async () => {
        setup({
          overrideRouterEntries: ['/projects']
        })

        expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
      })

      test('includes map classname on project page', async () => {
        setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/projects',
                search: '?projectid=1'
              }
            }
          }
        })

        expect(screen.getByTestId('parent-container'))
          .toHaveClass('wrapping-container', 'wrapping-container--map-page')
      })
    })

    describe('search page', () => {
      test('includes map classname on search route', async () => {
        setup({
          overrideRouterEntries: ['/search']
        })

        expect(screen.getByTestId('parent-container'))
          .toHaveClass('wrapping-container', 'wrapping-container--map-page')
      })
    })
  })
})
