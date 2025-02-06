import React from 'react'
import { render, screen } from '@testing-library/react'

import AvailableCustomizationsTooltipIcons from '../AvailableCustomizationsTooltipIcons'

const setup = (overrideProps) => {
  const props = {
    hasSpatialSubsetting: true,
    hasVariables: true,
    hasTransforms: true,
    hasFormats: true,
    hasTemporalSubsetting: true,
    hasCombine: true,
    ...overrideProps
  }

  return render(
    <AvailableCustomizationsTooltipIcons {...props} />
  )
}

describe('AvailableCustomizationsTooltipIcons component', () => {
  test('on load should contain all of the custom icons for the customizable options', () => {
    setup()

    // Ensure that each of the icons rendered
    expect(screen.getByTitle('A white clock icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white tags icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white horizontal sliders icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white file icon')).toBeInTheDocument()
    expect(screen.getByTitle('A white cubes icon')).toBeInTheDocument()
  })

  test('ensure Tool-Tip content are list items', () => {
    setup()
    const iconListItemsCount = screen.getAllByRole('listitem').length
    // Ensure that each of the icons rendered
    expect(iconListItemsCount).toEqual(6)
  })

  describe('when some of the the customizations are not supported', () => {
    test('those icons do not render', () => {
      setup({
        hasVariables: false,
        hasCombine: false
      })

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
