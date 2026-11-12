import {
  act,
  screen,
  within
} from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import AdvancedSearchFilters from '../AdvancedSearchFilters'
import useEdscStore from '../../../zustand/useEdscStore'

const changeQuery = vi.fn()
const setup = setupTest({
  Component: AdvancedSearchFilters,
  defaultProps: {
    onClose: vi.fn()
  },
  defaultZustandState: {
    query: { changeQuery },
    collections: {
      collections: {
        items: [
          {
            entryId: 'ATL03_004',
            shortName: 'ATL03',
            versionId: '004'
          },
          {
            entryId: 'ATL03_005',
            shortName: 'ATL03',
            versionId: '005'
          },
          {
            entryId: 'ATL06_006',
            shortName: 'ATL06',
            versionId: '006'
          }
        ]
      }
    }
  }
})

const setupLoaded = async (options) => {
  const result = setup(options)
  await screen.findByRole('textbox', { name: 'Add Entry ID' })

  return result
}

const addValue = async (user, label, value, key = null) => {
  const input = screen.getByRole('textbox', { name: `Add ${label}` })
  await user.type(input, value)

  if (key) {
    await user.keyboard(key)
  } else {
    await user.click(screen.getByRole('button', { name: `Add ${label}` }))
  }
}

describe('AdvancedSearchFilters', () => {
  test('hides consortium controls and excludes their selections from the count for a portal consortium', () => {
    setup({
      overrideZustandState: {
        portal: { query: { consortium: ['CWIC'] } },
        query: {
          collection: {
            consortium: ['CEOS']
          }
        }
      }
    })

    expect(screen.queryByRole('group', { name: /Consortium/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'EOSDIS' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
  })

  test('disables and clears consortium choices while EOSDIS-only is selected and unlocks them when deselected', async () => {
    const { user } = setup({
      overrideZustandState: {
        query: { collection: { consortium: ['CEOS'] } }
      }
    })

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    const tooltipButton = screen.getByRole('button', { name: 'Consortium filtering information' })
    expect(tooltipButton).toBeVisible()
    await user.hover(tooltipButton)
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Consortium filtering is disabled when only including EOSDIS collections'
    )

    await user.unhover(tooltipButton)

    act(() => {
      useEdscStore.setState((state) => ({
        query: {
          ...state.query,
          collection: {
            ...state.query.collection,
            onlyEosdisCollections: true,
            consortium: undefined
          }
        }
      }))
    })

    const consortiumSection = screen.getByRole('group', { name: 'Consortium' })
    const consortium = within(consortiumSection)
    consortium.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    await user.click(consortium.getByRole('checkbox', { name: 'CEOS' }))
    expect(changeQuery).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
    expect(consortium.queryByText(/Selected/)).not.toBeInTheDocument()

    act(() => {
      useEdscStore.setState((state) => ({
        query: {
          ...state.query,
          collection: {
            ...state.query.collection,
            onlyEosdisCollections: undefined
          }
        }
      }))
    })

    const enabledConsortium = within(screen.getByRole('group', { name: 'Consortium' }))

    enabledConsortium.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeEnabled()
      expect(checkbox).not.toBeChecked()
    })

    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()

    await user.click(enabledConsortium.getByRole('checkbox', { name: 'CEOS' }))
    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenCalledWith({ collection: { consortium: ['CEOS'] } })
  })

  test('hides the disabled consortium count without excluding other filters from the total', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            onlyEosdisCollections: true,
            consortium: ['EOSDIS', 'CEOS'],
            doi: ['10.5067/EXAMPLE']
          }
        }
      }
    })

    const consortium = within(screen.getByRole('group', { name: 'Consortium' }))
    consortium.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    expect(consortium.queryByText(/Selected/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Advanced Filters 1 Selected' })).toBeVisible()
  })

  test('focuses the Entry ID input when the column opens', () => {
    setup()

    expect(screen.getByRole('textbox', { name: 'Add Entry ID' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Close Advanced Filters' })).toBeVisible()
  })

  test('shows applied text values in their selected lists', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            doi: ['10.5067/SELECTED'],
            entryTitle: ['Selected Title']
          }
        }
      }
    })

    expect(screen.getByRole('list', { name: 'Selected values for DOI Value' }))
      .toHaveTextContent('10.5067/SELECTED')

    expect(screen.getByRole('list', { name: 'Selected values for Entry Title' }))
      .toHaveTextContent('Selected Title')
  })

  test('adds a literal value only when requested and trims whitespace', async () => {
    const { user } = setup()
    const input = screen.getByRole('textbox', { name: 'Add DOI Value' })
    const addButton = screen.getByRole('button', { name: 'Add DOI Value' })
    expect(addButton).toHaveClass('button--icon-only', 'advanced-search-filters__icon-button')
    expect(addButton).not.toHaveTextContent('Add')

    await user.type(input, ' 10.5067/EXAMPLE ')
    expect(changeQuery).not.toHaveBeenCalled()
    await user.click(addButton)

    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenCalledWith({ collection: { doi: ['10.5067/EXAMPLE'] } })
    expect(screen.getByRole('list', { name: 'Selected values for DOI Value' }))
      .toHaveTextContent('10.5067/EXAMPLE')

    expect(input).toHaveValue('')
  })

  test('adds values with Enter, rejects duplicates, and removes selected values', async () => {
    const { user } = setup({
      overrideZustandState: {
        query: { collection: { doi: ['10.5067/EXAMPLE'] } }
      }
    })

    const input = screen.getByRole('textbox', { name: 'Add DOI Value' })
    await user.type(input, '10.5067/EXAMPLE')
    expect(screen.getByRole('button', { name: 'Add DOI Value' })).toBeDisabled()

    await user.clear(input)
    await addValue(user, 'DOI Value', '10.5067/OTHER', '{Enter}')
    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenNthCalledWith(1, {
      collection: { doi: ['10.5067/EXAMPLE', '10.5067/OTHER'] }
    })

    const removeButton = screen.getByRole('button', { name: 'Remove DOI Value 10.5067/EXAMPLE' })
    expect(removeButton).toHaveClass('button--icon-only', 'advanced-search-filters__icon-button')
    await user.click(removeButton)
    expect(changeQuery).toHaveBeenCalledTimes(2)
    expect(changeQuery).toHaveBeenNthCalledWith(2, { collection: { doi: ['10.5067/OTHER'] } })
  })

  test('shows applied identifier values in their selected lists', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            entryId: ['CUSTOM_ENTRY'],
            shortName: ['CUSTOM_SHORT'],
            version: ['custom-version']
          }
        }
      }
    })

    expect(screen.getByRole('list', { name: 'Selected values for Entry ID' }))
      .toHaveTextContent('CUSTOM_ENTRY')

    expect(screen.getByRole('list', { name: 'Selected values for Short Name' }))
      .toHaveTextContent('CUSTOM_SHORT')

    expect(screen.getByRole('list', { name: 'Selected values for Version' }))
      .toHaveTextContent('custom-version')
  })

  test('shows a selected count beside each advanced filter label', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            entryId: ['ENTRY_001', 'ENTRY_002'],
            collectionProgress: ['ACTIVE', 'COMPLETE'],
            downloadable: true
          }
        }
      }
    })

    expect(within(screen.getByRole('group', { name: /Entry ID/ })).getByText('2 Selected'))
      .toHaveClass('facets-group__selected-count')

    expect(within(screen.getByRole('group', { name: /Collection Progress/ })).getByText('2 Selected'))
      .toHaveClass('facets-group__selected-count')

    const downloadableFilter = screen.getByRole('group', { name: 'Downloadable' })
    expect(within(downloadableFilter).getByText('1 Selected'))
      .toHaveClass('facets-group__selected-count')
  })

  test('accepts arbitrary multiple values for each collection identifier', async () => {
    const { user } = await setupLoaded()

    await addValue(user, 'Entry ID', 'CUSTOM_001')
    await addValue(user, 'Entry ID', 'CUSTOM_002')
    await addValue(user, 'Short Name', 'CUSTOM_SHORT_A')
    await addValue(user, 'Short Name', 'CUSTOM_SHORT_B')
    await addValue(user, 'Version', 'vA')
    await addValue(user, 'Version', 'vB')

    expect(changeQuery).toHaveBeenCalledTimes(6)
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['CUSTOM_001'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, {
      collection: { entryId: ['CUSTOM_001', 'CUSTOM_002'] }
    })

    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { shortName: ['CUSTOM_SHORT_A'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(4, {
      collection: { shortName: ['CUSTOM_SHORT_A', 'CUSTOM_SHORT_B'] }
    })

    expect(changeQuery).toHaveBeenNthCalledWith(5, { collection: { version: ['vA'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(6, { collection: { version: ['vA', 'vB'] } })
  })

  test('groups identifier text entries in the Collection Identifier section', () => {
    setup()
    const identifiersGroup = screen.getByRole('group', { name: 'Collection Identifier' })
    const identifiers = within(identifiersGroup)

    expect(identifiersGroup).toHaveClass('advanced-search-filters__identifier-section')
    expect(identifiers.getByRole('textbox', { name: 'Add Entry ID' })).toBeVisible()
    expect(identifiers.getByRole('textbox', { name: 'Add Short Name' })).toBeVisible()
    expect(identifiers.getByRole('textbox', { name: 'Add Version' })).toBeVisible()
    expect(identifiers.getByText('Collection Identifier'))
      .toHaveClass('advanced-search-filters__section-heading')

    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  test('groups collection metadata and access filters in their sections', () => {
    setup()
    const collectionMetadata = within(screen.getByRole('group', { name: 'Collection Metadata' }))
    expect(collectionMetadata.getByRole('group', { name: 'Consortium' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Collection Data Type' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Collection Progress' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'DOI Value' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Entry Title' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Variable Name' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Service Name' })).toBeVisible()
    expect(collectionMetadata.getByRole('group', { name: 'Tool Name' })).toBeVisible()
    expect(collectionMetadata.getByText('Collection Metadata'))
      .toHaveClass('advanced-search-filters__section-heading')

    expect(screen.getByText('Access Options'))
      .toHaveClass('advanced-search-filters__section-heading')
  })

  test('shows the selected filter count in the heading', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            entryId: ['ATL03_004'],
            shortName: ['ATL06']
          }
        }
      }
    })

    const heading = screen.getByRole('heading', { name: 'Advanced Filters 2 Selected' })
    const selectedCount = within(heading).getByText('2 Selected')
    expect(selectedCount).toBeVisible()
    expect(selectedCount).toHaveClass('facets-group__selected-count')
  })

  test('applies a checkbox filter when its label is clicked', async () => {
    const { user } = await setupLoaded()

    await user.click(screen.getByText('CEOS'))

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenCalledWith({ collection: { consortium: ['CEOS'] } })
  })

  test('applies advanced fields immediately and only clears collection identifiers', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Version', '004')
    await addValue(user, 'DOI Value', '10.5067/EXAMPLE')
    await addValue(user, 'Entry Title', 'Example Collection')
    await addValue(user, 'Variable Name', 'temperature')
    await addValue(user, 'Service Name', 'test_service')
    await addValue(user, 'Tool Name', 'test_tool')
    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    await user.click(screen.getByRole('checkbox', { name: 'SCIENCE QUALITY' }))
    await user.click(screen.getByRole('checkbox', { name: 'ACTIVE' }))
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    await user.click(screen.getByRole('checkbox', { name: 'Browsable' }))

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Online Only' })).not.toBeInTheDocument()

    expect(changeQuery).toHaveBeenCalledTimes(13)
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['ATL03_004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, { collection: { shortName: ['ATL03'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { version: ['004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(4, { collection: { doi: ['10.5067/EXAMPLE'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(5, { collection: { entryTitle: ['Example Collection'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(6, { collection: { variableName: ['temperature'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(7, { collection: { serviceName: ['test_service'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(8, { collection: { toolName: ['test_tool'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(9, { collection: { consortium: ['CEOS'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(10, {
      collection: { collectionDataType: ['SCIENCE_QUALITY'] }
    })

    expect(changeQuery).toHaveBeenNthCalledWith(11, { collection: { collectionProgress: ['ACTIVE'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(12, { collection: { downloadable: true } })
    expect(changeQuery).toHaveBeenNthCalledWith(13, { collection: { browsable: true } })

    await user.click(screen.getByRole('button', { name: 'Remove Entry ID ATL03_004' }))

    expect(screen.getByRole('list', { name: 'Selected values for DOI Value' }))
      .toHaveTextContent('10.5067/EXAMPLE')

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenCalledTimes(14)
    expect(changeQuery).toHaveBeenNthCalledWith(14, { collection: { entryId: undefined } })

    expect(screen.getByRole('list', { name: 'Selected values for Short Name' }))
      .toHaveTextContent('ATL03')

    expect(screen.getByRole('list', { name: 'Selected values for Version' }))
      .toHaveTextContent('004')
  })

  test('removes advanced filters independently without clearing identifiers', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    await addValue(user, 'DOI Value', '10.5067/EXAMPLE')

    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    expect(changeQuery).toHaveBeenCalledTimes(5)
    expect(changeQuery).toHaveBeenNthCalledWith(5, { collection: { consortium: undefined } })
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    expect(changeQuery).toHaveBeenCalledTimes(6)
    expect(changeQuery).toHaveBeenNthCalledWith(6, { collection: { downloadable: undefined } })
    await user.click(screen.getByRole('button', { name: 'Remove DOI Value 10.5067/EXAMPLE' }))
    expect(changeQuery).toHaveBeenCalledTimes(7)
    expect(changeQuery).toHaveBeenNthCalledWith(7, { collection: { doi: undefined } })
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['ATL03_004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, { collection: { consortium: ['CEOS'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { downloadable: true } })
    expect(changeQuery).toHaveBeenNthCalledWith(4, { collection: { doi: ['10.5067/EXAMPLE'] } })
    expect(screen.getByRole('list', { name: 'Selected values for Entry ID' }))
      .toHaveTextContent('ATL03_004')
  })

  test('keeps selected identifiers when collection results change', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')

    await act(() => {
      useEdscStore.setState((state) => ({
        collections: {
          ...state.collections,
          collections: {
            ...state.collections.collections,
            isLoading: true,
            items: []
          }
        }
      }))
    })

    expect(screen.getByRole('list', { name: 'Selected values for Entry ID' }))
      .toHaveTextContent('ATL03_004')

    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenCalledWith({ collection: { entryId: ['ATL03_004'] } })
  })

  test('supports closing the column with the close button and Escape', async () => {
    const { props, user } = setup()

    expect(screen.getByRole('textbox', { name: 'Add Entry ID' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(props.onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Close Advanced Filters' }))
    expect(props.onClose).toHaveBeenCalledTimes(2)
  })

  test('allows entering a short name without a version', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Short Name', 'ATL03')

    expect(changeQuery).toHaveBeenCalledTimes(1)
    expect(changeQuery).toHaveBeenCalledWith({
      collection: { shortName: ['ATL03'] }
    })

    expect(screen.getByRole('textbox', { name: 'Add Version' })).toBeVisible()
  })

  test('shows all identifier fields and updates them independently', async () => {
    const { user } = await setupLoaded()

    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Version', '004')

    expect(changeQuery).toHaveBeenCalledTimes(3)
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['ATL03_004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, { collection: { shortName: ['ATL03'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { version: ['004'] } })
  })

  test('supports multiple values for each identifier field', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Entry ID', 'ATL03_005')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Short Name', 'ATL06')
    await addValue(user, 'Version', '004')
    await addValue(user, 'Version', '005')

    expect(changeQuery).toHaveBeenCalledTimes(6)
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['ATL03_004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, {
      collection: { entryId: ['ATL03_004', 'ATL03_005'] }
    })

    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { shortName: ['ATL03'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(4, { collection: { shortName: ['ATL03', 'ATL06'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(5, { collection: { version: ['004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(6, { collection: { version: ['004', '005'] } })
  })

  test('removes an Entry ID value without clearing other identifiers', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Version', '004')

    await user.click(screen.getByRole('button', { name: 'Remove Entry ID ATL03_004' }))

    expect(changeQuery).toHaveBeenCalledTimes(4)
    expect(changeQuery).toHaveBeenNthCalledWith(4, { collection: { entryId: undefined } })
    expect(screen.queryByRole('list', { name: 'Selected values for Entry ID' }))
      .not.toBeInTheDocument()

    expect(screen.getByRole('list', { name: 'Selected values for Short Name' }))
      .toHaveTextContent('ATL03')

    expect(screen.getByRole('list', { name: 'Selected values for Version' }))
      .toHaveTextContent('004')
  })

  test('retains arbitrary Entry ID values when collection results change', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'CUSTOM_001')
    await addValue(user, 'Entry ID', 'CUSTOM_002')

    await act(() => {
      useEdscStore.setState((state) => ({
        collections: {
          ...state.collections,
          collections: {
            ...state.collections.collections,
            items: [{
              entryId: 'ATL03_004',
              shortName: 'ATL03',
              versionId: '004'
            }]
          }
        }
      }))
    })

    expect(screen.getByRole('list', { name: 'Selected values for Entry ID' }))
      .toHaveTextContent('CUSTOM_001')
      .toHaveTextContent('CUSTOM_002')

    expect(changeQuery).toHaveBeenCalledTimes(2)
    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['CUSTOM_001'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, {
      collection: { entryId: ['CUSTOM_001', 'CUSTOM_002'] }
    })
  })
})
