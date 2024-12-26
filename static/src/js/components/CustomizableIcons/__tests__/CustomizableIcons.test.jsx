import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomizableIcons from '../CustomizableIcons'

const setup = (overrideProps) => {
  const props = {
    hasSpatialSubsetting: true,
    hasVariables: true,
    hasTransforms: true,
    hasFormats: true,
    hasTemporalSubsetting: true,
    hasCombine: true,
    forAccessMethodRadio: false,
    ...overrideProps
  }

  return render(
    <CustomizableIcons {...props} />
  )
}

describe('CustomizableIcons component', () => {
  test('on load should contain all of the custom icons for the customizable options', () => {
    setup()

    // Ensure that when not using the `forAccessMethodRadio`, use `metaIconClasses`
    const metaIconContainer = screen.getByTestId('meta-icon')
    expect(metaIconContainer).toHaveClass(
      'meta-icon',
      'collection-results-item__meta-icon',
      'collection-results-item__meta-icon--customizable'
    )

    // Ensure that each of the icons rendered
    expect(screen.getByTitle('A white globe icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white clock icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white tags icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white horizontal sliders icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white file icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white cubes icon')).toBeInTheDocument()
  })

  describe('if the customizableIcon is for the access method radio', () => {
    test('the class name should include the access method class', () => {
      setup({ forAccessMethodRadio: true })

      const metaIconContainer = screen.getByTestId('meta-icon')
      expect(metaIconContainer).toHaveClass(
        'meta-icon',
        'collection-results-item__meta-icon',
        'collection-results-item__meta-icon--customizable',
        'meta-icon__accessMethod'
      )
    })
  })

  describe('if some of the conditionals are false', () => {
    test('those icons do not render', () => {
      setup({
        hasVariables: false,
        hasCombine: false
      })

      // Ensure that when not using the `forAccessMethodRadio` use `metaIconClasses`
      const metaIconContainer = screen.getByTestId('meta-icon')
      expect(metaIconContainer).toHaveClass(
        'meta-icon',
        'collection-results-item__meta-icon',
        'collection-results-item__meta-icon--customizable'
      )

      // Ensure that each of the icons that are supposed to render do
      expect(screen.getByTitle('A white globe icon')).toBeInTheDocument()
      expect(screen.getByTitle('A white clock icon')).toBeInTheDocument()
      expect(screen.getByTitle('A white horizontal sliders icon')).toBeInTheDocument()
      expect(screen.getByTitle('A white file icon')).toBeInTheDocument()

      // Ensure that the icons for `hasVariables` and `hasCombine` which were passed false do not render
      expect(screen.queryByTitle('A white cubes icon')).not.toBeInTheDocument()
      expect(screen.queryByTitle('A white tags icon')).not.toBeInTheDocument()
    })
  })
})
