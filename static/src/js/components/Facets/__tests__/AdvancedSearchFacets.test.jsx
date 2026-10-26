import {
  act,
  fireEvent,
  screen,
  within
} from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import AdvancedSearchFacets from '../AdvancedSearchFacets'
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
  Component: AdvancedSearchFacets,
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
            entryId: 'ATL06_006',
            shortName: 'ATL06',
            versionId: '006'
          },
          {
            entryId: 'ATL03_005',
            shortName: 'ATL03',
            versionId: '005'
          }
        ]
      }
    }
  }
})

describe('AdvancedSearchFacets', () => {
  test('checks Entry IDs already present in the collection query', () => {
    setup()

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

  test('shows the selected filter count in the heading', async () => {
    const { user } = setup()

    expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
    expect(screen.queryByText('Selected')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))
    await user.click(screen.getByRole('checkbox', { name: 'ATL06_006' }))

    expect(screen.getByText('2 Options Selected')).toBeVisible()
  })

  test('applies a checkbox filter when its label is clicked', async () => {
    const { user } = setup()

    await user.click(screen.getByText('CEOS'))

    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { consortium: ['CEOS'] } })
  })

  test('applies advanced fields immediately and only clears collection identifiers', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox', { name: 'DOI Value' }), '10.5067/EXAMPLE')
    await user.type(screen.getByRole('textbox', { name: 'Entry Title' }), 'Example Collection')
    await user.type(screen.getByRole('textbox', { name: 'Variable Name' }), 'temperature')
    await user.type(screen.getByRole('textbox', { name: 'Service Name' }), 'test_service')
    await user.type(screen.getByRole('textbox', { name: 'Tool Name' }), 'test_tool')
    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    await user.click(screen.getByRole('checkbox', { name: 'SCIENCE QUALITY' }))
    await user.click(screen.getByRole('checkbox', { name: 'ACTIVE' }))
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    await user.click(screen.getByRole('checkbox', { name: 'Browsable' }))

    fireEvent.change(screen.getByLabelText('New Granules Since (UTC)'), {
      target: { value: '2026-01-01T12:34:56' }
    })

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Online Only' })).not.toBeInTheDocument()

    expect(useEdscStore.getState().query.collection).toEqual(expect.objectContaining({
      doi: '10.5067/EXAMPLE',
      entryTitle: 'Example Collection',
      consortium: ['CEOS'],
      hasGranulesCreatedAt: '2026-01-01T12:34:56Z,',
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE'],
      downloadable: true,
      browsable: true,
      variableName: 'temperature',
      serviceName: 'test_service',
      toolName: 'test_tool'
    }))

    expect(within(screen.getByRole('group', { name: 'Collection Identifier' }))
      .getByRole('button', { name: 'Clear' })).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByRole('textbox', { name: 'DOI Value' })).toHaveValue('10.5067/EXAMPLE')
    expect(screen.getByRole('checkbox', { name: 'CEOS' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).not.toBeChecked()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: undefined,
        version: undefined
      }
    })

    expect(useEdscStore.getState().query.collection.doi).toBe('10.5067/EXAMPLE')
    expect(useEdscStore.getState().query.collection.consortium).toEqual(['CEOS'])
  })

  test('removes advanced filters independently without clearing identifiers', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'ATL03_004' }))
    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    await user.type(screen.getByRole('textbox', { name: 'DOI Value' }), '10.5067/EXAMPLE')

    await user.click(screen.getByRole('checkbox', { name: 'CEOS' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { consortium: undefined } })
    await user.click(screen.getByRole('checkbox', { name: 'Downloadable' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { downloadable: undefined } })
    await user.clear(screen.getByRole('textbox', { name: 'DOI Value' }))
    expect(changeQuery).toHaveBeenLastCalledWith({ collection: { doi: undefined } })
    expect(useEdscStore.getState().query.collection.entryId).toEqual(['ATL03_004'])
    expect(screen.getByRole('checkbox', { name: 'ATL03_004' })).toBeChecked()
  })

  test('keeps selected identifiers checked while collection results are loading', async () => {
    const { user } = setup()
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
    const { user } = setup({ overrideProps: { onClose } })

    expect(screen.getByRole('form', { name: 'Advanced Filters' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Close Advanced Filters' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  test('allows searching by short name without selecting a version', async () => {
    const { user } = setup()
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
    const { user } = setup()

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
    const { user } = setup()
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

    expect(screen.getByRole('checkbox', { name: '004' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: '005' })).toBeDisabled()
    expect(changeQuery).toHaveBeenLastCalledWith({
      collection: {
        entryId: undefined,
        shortName: ['ATL03', 'ATL06'],
        version: undefined
      }
    })
  })

  test('checks short names and versions already present in the collection query', async () => {
    const { user } = setup()
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
    const { user } = setup()
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
    const { user } = setup()
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
