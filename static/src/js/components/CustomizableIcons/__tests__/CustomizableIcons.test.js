import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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

    // Ensure the when not using the `forAccessMethodRadio` use `metaIconClasses`
    const metaIcon = screen.getByText('Customize')
    const metaIconWrapper = metaIcon.parentElement
    expect(metaIconWrapper.className).toEqual('meta-icon collection-results-item__meta-icon collection-results-item__meta-icon--customizable')

    // Ensure that each of the icons rendered
    expect(screen.getByTitle('A white globe icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white clock icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white tags icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white horizontal sliders icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white file icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white cubes icon')).toBeInTheDocument()
  })

  describe('if the customizableIcon is for the access method radio', () => {
    test('the class name should be appended with', () => {
      setup({ forAccessMethodRadio: true })

      // Ensure the when using the `forAccessMethodRadio` adds the `meta-icon__accessMethod` to classname
      const metaIcon = screen.getByText('Customize')
      const metaIconWrapper = metaIcon.parentElement
      expect(metaIconWrapper.className).toEqual('meta-icon collection-results-item__meta-icon collection-results-item__meta-icon--customizable meta-icon__accessMethod')
    })
  })

  describe('if some of the conditionals are false', () => {
    test('those icons do not render', () => {
      setup({
        hasVariables: false,
        hasCombine: false
      })

      // Ensure the when not using the `forAccessMethodRadio` use `metaIconClasses`
      const metaIcon = screen.getByText('Customize')
      const metaIconWrapper = metaIcon.parentElement
      expect(metaIconWrapper.className).toEqual('meta-icon collection-results-item__meta-icon collection-results-item__meta-icon--customizable')

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
