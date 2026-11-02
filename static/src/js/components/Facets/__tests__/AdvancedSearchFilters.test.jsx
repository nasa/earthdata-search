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
  await screen.findByRole('checkbox', { name: 'ATL03_004' })

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

  test('checks Entry IDs already present in the collection query', async () => {
    await setupLoaded()

    act(() => {
      useEdscStore.setState((state) => ({
        query: {
          ...state.query,
          collection: {
            ...state.query.collection,
            entryId: ['ATL03_004']
          }
        }
      }))
    })

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
  })

  test('populates identifier checkboxes from initial collection results', async () => {
    const { user } = await setupLoaded()

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeVisible()

    await user.click(screen.getByRole('radio', { name: 'Short Name and Version' }))
    expect(screen.getByRole('checkbox', { name: 'ATL03' })).toBeVisible()
    expect(screen.getByRole('checkbox', { name: 'ATL06' })).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03' }))
    expect(screen.getByRole('checkbox', { name: '004' })).toBeVisible()
    expect(screen.getByRole('checkbox', { name: '005' })).toBeVisible()
  })

  test('orders filter groups by search workflow', () => {
    setup()
    const filterGroups = screen.getAllByRole('group')
    const filterLabels = [
      'New Granules Since (UTC)',
      'Collection Identifier',
      'Consortium',
      'Collection Data Type',
      'Collection Progress',
      'DOI Value',
      'Entry Title',
      'Variable Name',
      'Service Name',
      'Tool Name',
      'Access Options'
    ]

    expect(filterGroups).toHaveLength(filterLabels.length)
    filterLabels.forEach((label, index) => {
      expect(filterGroups[index]).toHaveAccessibleName(label)
    })
  })

  test('shows the selected filter count in the heading', async () => {
    const { user } = await setupLoaded()

    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
    expect(screen.queryByText('Selected')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))
    await user.click(screen.getByRole('checkbox', { name: 'ATL06_006' }))

    expect(screen.getByText('2 Options Selected')).toBeVisible()
  })

  test('applies a checkbox filter when its label is clicked', async () => {
    const { user } = await setupLoaded()

    await user.click(screen.getByText('CEOS'))

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { consortium: ['CEOS'] } })
  })

  test('applies advanced fields immediately and only clears collection identifiers', async () => {
    const { user } = await setupLoaded()
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
      .getByLabelText('New Granules Since (UTC)'), {
      target: { value: '2026-01-01T12:34:56' }
    })

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Online Only' })).not.toBeInTheDocument()

    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      doi: ['10.5067/EXAMPLE'],
      entryTitle: ['Example Collection'],
      consortium: ['CEOS'],
      hasGranulesCreatedAt: '2026-01-01T12:34:56Z,',
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE'],
      downloadable: true,
      browsable: true,
      variableName: ['temperature'],
      serviceName: ['test_service'],
      toolName: ['test_tool']
    }))

    expect(within(screen.getByRole('group', { name: 'Collection Identifier' }))
      .getByRole('button', { name: 'Clear' })).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByRole('list', { name: 'Selected values for DOI Value' }))
      .toHaveTextContent('10.5067/EXAMPLE')

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).not.toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: undefined,
        version: undefined
      }
    })

    expect(useEdscStore.getState().query.collection.doi).toEqual(['10.5067/EXAMPLE'])
    expect(useEdscStore.getState().query.collection.consortium).toEqual(['CEOS'])
  })

  test('removes advanced filters independently without clearing identifiers', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))
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
    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
  })

  test('keeps selected identifiers checked while collection results are loading', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

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

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'ATL06_006' })).toBeInTheDocument()
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

  test('allows searching by short name without selecting a version', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('radio', { name: 'Short Name and Version' }))

    await user.click(screen.getByRole('checkbox', { name: 'ATL03' }))

    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: ['ATL03'],
        version: undefined
      }
    })
  })

  test('only shows inputs for the selected radio option', async () => {
    const { user } = await setupLoaded()

    const entryId = screen.getByRole('checkbox', { name: 'ATL03_004' })

    expect(entryId).toBeVisible()
    expect(screen.queryByRole('checkbox', { name: 'ATL03' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '004' })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Entry ID' })).toBeChecked()
    expect(entryId).toBeEnabled()

    await user.click(screen.getByRole('radio', { name: 'Short Name and Version' }))

    expect(screen.queryByRole('checkbox', { name: 'ATL03_004' })).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'ATL03' })).toBeVisible()
    expect(screen.queryByRole('checkbox', { name: '004' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03' }))
    await user.click(screen.getByRole('checkbox', { name: '004' }))

    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: ['ATL03'],
        version: ['004']
      }
    })

    await user.click(screen.getByRole('radio', { name: 'Entry ID' }))
    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeEnabled()
    expect(screen.queryByRole('checkbox', { name: 'ATL03' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '004' })).not.toBeInTheDocument()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: undefined,
        version: undefined
      }
    })
  })

  test('supports multiple short names or multiple versions for one short name', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('radio', { name: 'Short Name and Version' }))

    await user.click(screen.getByRole('checkbox', { name: 'ATL03' }))
    await user.click(screen.getByRole('checkbox', { name: '004' }))
    await user.click(screen.getByRole('checkbox', { name: '005' }))

    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: ['ATL03'],
        version: ['004', '005']
      }
    })

    await user.click(screen.getByRole('checkbox', { name: 'ATL06' }))

    expect(screen.queryByRole('group', { name: 'Version' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '004' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '005' })).not.toBeInTheDocument()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: ['ATL03', 'ATL06'],
        version: undefined
      }
    })

    await user.click(screen.getByRole('checkbox', { name: 'ATL06' }))

    expect(screen.getByRole('group', { name: 'Version' })).toBeVisible()
    expect(screen.getByRole('checkbox', { name: '004' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '005' })).not.toBeChecked()
  })

  test('checks short names and versions already present in the collection query', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('radio', { name: 'Short Name and Version' }))

    act(() => {
      useEdscStore.setState((state) => ({
        query: {
          ...state.query,
          collection: {
            ...state.query.collection,
            shortName: ['ATL03'],
            version: ['004', '005']
          }
        }
      }))
    })

    expect(screen.getByRole('checkbox', { name: 'ATL03' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '004' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '005' })).toBeChecked()
  })

  test('applies Entry IDs immediately and clears them with Clear', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: ['ATL03_004'],
        shortName: undefined,
        version: undefined
      }
    })

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).not.toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: undefined,
        version: undefined
      }
    })
  })

  test('retains Entry ID choices after filtered responses and allows multiple selections', async () => {
    const { user } = await setupLoaded()
    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

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

    await user.click(screen.getByRole('checkbox', { name: 'ATL06_006' }))

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'ATL06_006' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: ['ATL03_004', 'ATL06_006'],
        shortName: undefined,
        version: undefined
      }
    })

    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'ATL06_006' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: ['ATL06_006'],
        shortName: undefined,
        version: undefined
      }
    })

    await user.click(screen.getByRole('checkbox', { name: 'ATL06_006' }))

    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: undefined,
        version: undefined
      }
    })
  })
})
