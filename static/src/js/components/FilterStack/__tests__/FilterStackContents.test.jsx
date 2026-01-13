import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import FilterStackContents from '../FilterStackContents'

const setup = setupTest({
  Component: FilterStackContents,
  defaultProps: {
    body: <div>Test Body</div>,
    title: 'Test'
  }
})

describe('FilterStackContents component', () => {
  test('does not render without a body prop', () => {
    const { container } = setup({
      overrideProps: {
        body: null,
        title: 'Test'
      }
    })

    expect(container.innerHTML).toBe('')
  })

  test('does not render without a title prop', () => {
    const { container } = setup({
      overrideProps: {
        body: <div>Test Body</div>,
        title: null
      }
    })

    expect(container.innerHTML).toBe('')
  })

  test('renders itself correctly correct props', () => {
    setup()

    expect(screen.getByText('Test:')).toBeInTheDocument()
    expect(screen.getByText('Test Body')).toBeInTheDocument()
  })

  test('adds the correct css classes when showLabel is true', () => {
    setup({
      overrideProps: {
        showLabel: true
      }
    })

    expect(screen.getByText('Test:').className).toContain('filter-stack-contents__label filter-stack-contents__label--visible')
  })
})
