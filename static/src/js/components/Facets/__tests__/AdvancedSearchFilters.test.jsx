import {
  act,
  fireEvent,
  screen,
  within
} from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import AdvancedSearchFilters from '../AdvancedSearchFilters'
import useEdscStore from '../../../zustand/useEdscStore'

const changeQuery = vi.fn(({ collection }) => {
  useEdscStore.setState((state) => ({
    query: {
      ...state.query,
      collection: {
        ...state.query.collection,
        ...collection
      }
    }
  }))
})
const setup = setupTest({
  Component: AdvancedSearchFilters,
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

    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { doi: ['10.5067/EXAMPLE'] } })
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
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: { doi: ['10.5067/EXAMPLE', '10.5067/OTHER'] }
    })

    const removeButton = screen.getByRole('button', { name: 'Remove DOI Value 10.5067/EXAMPLE' })
    expect(removeButton).toHaveClass('button--icon-only', 'advanced-search-filters__icon-button')
    await user.click(removeButton)
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { doi: ['10.5067/OTHER'] } })
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
            hasGranulesCreatedAt: '2026-01-01T00:00:00Z,',
            downloadable: true
          }
        }
      }
    })

    expect(within(screen.getByRole('group', { name: /Entry ID/ })).getByText('2 Selected'))
      .toHaveClass('facets-group__selected-count')

    expect(within(screen.getByRole('group', { name: /Collection Progress/ })).getByText('2 Selected'))
      .toHaveClass('facets-group__selected-count')

    expect(within(screen.getByRole('group', { name: 'New Granules Since (UTC)' })).getByText('1 Selected'))
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

    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      entryId: ['CUSTOM_001', 'CUSTOM_002'],
      shortName: ['CUSTOM_SHORT_A', 'CUSTOM_SHORT_B'],
      version: ['vA', 'vB']
    }))
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

  test('groups the granule date filters under Granule Activity', () => {
    setup()
    const granuleActivityGroup = screen.getByRole('group', { name: 'Granule Activity' })
    const granuleActivity = within(granuleActivityGroup)

    expect(granuleActivity.getByRole('group', { name: 'New Granules Since (UTC)' })).toBeVisible()
    expect(granuleActivity.getByRole('group', { name: 'Revised Granules Since (UTC)' })).toBeVisible()
    expect(granuleActivity.getByText('Granule Activity'))
      .toHaveClass('advanced-search-filters__section-heading')

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

  test('shows the selected filter count in the heading', async () => {
    const { user } = await setupLoaded()

    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
    expect(screen.queryByText('Selected')).not.toBeInTheDocument()

    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL06')

    const selectedCount = screen.getByText('2 Selected')
    expect(selectedCount).toBeVisible()
    expect(selectedCount).toHaveClass('facets-group__selected-count')
  })

  test('applies a checkbox filter when its label is clicked', async () => {
    const { user } = await setupLoaded()

    await user.click(screen.getByText('CEOS'))

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { consortium: ['CEOS'] } })
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

    fireEvent.change(within(screen.getByRole('group', { name: 'New Granules Since (UTC)' }))
      .getByRole('textbox'), {
      target: { value: '2026-01-01' }
    })

    fireEvent.blur(within(screen.getByRole('group', { name: 'New Granules Since (UTC)' }))
      .getByRole('textbox'))

    fireEvent.change(within(screen.getByRole('group', { name: 'Revised Granules Since (UTC)' }))
      .getByRole('textbox'), {
      target: { value: '2026-02-01' }
    })

    fireEvent.blur(within(screen.getByRole('group', { name: 'Revised Granules Since (UTC)' }))
      .getByRole('textbox'))

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Online Only' })).not.toBeInTheDocument()

    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      entryId: ['ATL03_004'],
      shortName: ['ATL03'],
      version: ['004'],
      doi: ['10.5067/EXAMPLE'],
      entryTitle: ['Example Collection'],
      consortium: ['CEOS'],
      hasGranulesCreatedAt: '2026-01-01T00:00:00Z,',
      hasGranulesRevisedAt: '2026-02-01T00:00:00Z,',
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE'],
      downloadable: true,
      browsable: true,
      variableName: ['temperature'],
      serviceName: ['test_service'],
      toolName: ['test_tool']
    }))

    expect(screen.getAllByText('YYYY-MM-DD')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Remove Entry ID ATL03_004' }))

    expect(screen.getByRole('list', { name: 'Selected values for DOI Value' }))
      .toHaveTextContent('10.5067/EXAMPLE')

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { entryId: undefined } })

    expect(useEdscStore.getState().query.collection.doi).toEqual(['10.5067/EXAMPLE'])
    expect(useEdscStore.getState().query.collection.consortium).toEqual(['CEOS'])
    expect(useEdscStore.getState().query.collection.shortName).toEqual(['ATL03'])
    expect(useEdscStore.getState().query.collection.version).toEqual(['004'])
  })

  test('removes advanced filters independently without clearing identifiers', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    await addValue(user, 'DOI Value', '10.5067/EXAMPLE')

    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { consortium: undefined } })
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { downloadable: undefined } })
    await user.click(screen.getByRole('button', { name: 'Remove DOI Value 10.5067/EXAMPLE' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { doi: undefined } })
    expect(useEdscStore.getState().query.collection.entryId).toEqual(['ATL03_004'])
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

    expect(useEdscStore.getState().query.collection.entryId).toEqual(['ATL03_004'])
  })

  test('supports closing the column with the close button and Escape', async () => {
    const onClose = vi.fn()
    const { user } = await setupLoaded({ overrideProps: { onClose } })

    expect(screen.getByRole('form', { name: 'Advanced Filters' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Close Advanced Filters' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  test('allows entering a short name without a version', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Short Name', 'ATL03')

    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: { shortName: ['ATL03'] }
    })

    expect(screen.getByRole('textbox', { name: 'Add Version' })).toBeVisible()
  })

  test('shows all identifier fields and updates them independently', async () => {
    const { user } = await setupLoaded()

    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Version', '004')

    expect(changeQuery).toHaveBeenNthCalledWith(1, { collection: { entryId: ['ATL03_004'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(2, { collection: { shortName: ['ATL03'] } })
    expect(changeQuery).toHaveBeenNthCalledWith(3, { collection: { version: ['004'] } })
    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      entryId: ['ATL03_004'],
      shortName: ['ATL03'],
      version: ['004']
    }))
  })

  test('supports multiple values for each identifier field', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Entry ID', 'ATL03_005')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Short Name', 'ATL06')
    await addValue(user, 'Version', '004')
    await addValue(user, 'Version', '005')

    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      entryId: ['ATL03_004', 'ATL03_005'],
      shortName: ['ATL03', 'ATL06'],
      version: ['004', '005']
    }))
  })

  test('removes an Entry ID value without clearing other identifiers', async () => {
    const { user } = await setupLoaded()
    await addValue(user, 'Entry ID', 'ATL03_004')
    await addValue(user, 'Short Name', 'ATL03')
    await addValue(user, 'Version', '004')

    await user.click(screen.getByRole('button', { name: 'Remove Entry ID ATL03_004' }))

    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { entryId: undefined } })
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

    expect(useEdscStore.getState().query.collection.entryId).toEqual(['CUSTOM_001', 'CUSTOM_002'])
  })
})
