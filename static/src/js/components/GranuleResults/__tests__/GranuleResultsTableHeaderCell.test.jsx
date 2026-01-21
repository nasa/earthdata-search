import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import GranuleResultsTableHeaderCell from '../GranuleResultsTableHeaderCell'
import { metricsAddGranuleToProject } from '../../../util/metrics/metricsAddGranuleToProject'

vi.mock('../../../util/metrics/metricsAddGranuleToProject', () => ({
  metricsAddGranuleToProject: vi.fn()
}))

const defaultCustomProps = {
  addGranuleToProjectCollection: vi.fn(),
  collectionId: 'collectionId',
  collectionQuerySpatial: {},
  collectionTags: {},
  directDistributionInformation: {},
  isGranuleInProject: vi.fn().mockReturnValue(false),
  location: {},
  onExcludeGranule: vi.fn(),
  removeGranuleFromProjectCollection: vi.fn()
}

const setup = setupTest({
  Component: GranuleResultsTableHeaderCell,
  defaultProps: {
    column: {
      customProps: defaultCustomProps
    },
    cell: {
      value: 'test value'
    },
    row: {
      original: {
        id: 'one',
        isOpenSearch: false,
        dataLinks: [],
        s3Links: [],
        onlineAccessFlag: true,
        handleClick: vi.fn()
      }
    }
  },
  defaultZustandState: {
    granule: {
      setGranuleId: vi.fn()
    },
    portal: {
      features: {
        authentication: true
      }
    }
  },
  withApolloClient: true,
  withRouter: true
})

describe('GranuleResultsTableHeaderCell component', () => {
  test('renders correctly', () => {
    setup()

    expect(screen.getByRole('heading', {
      name: 'test value',
      level: 4
    })).toBeInTheDocument()
  })

  test('clicking the details button calls setGranuleId', async () => {
    const { user, zustandState } = setup()

    const dropdownButton = screen.getByRole('button', {
      name: 'More actions'
    })

    await user.click(dropdownButton)

    const detailsButton = screen.getByRole('button', {
      name: 'View details'
    })
    await user.click(detailsButton)

    expect(zustandState.granule.setGranuleId).toHaveBeenCalledTimes(1)
    expect(zustandState.granule.setGranuleId).toHaveBeenCalledWith('one')
  })

  test('clicking the filter button calls onExcludeGranule', async () => {
    const { props, user } = setup()

    const dropdownButton = screen.getByRole('button', {
      name: 'More actions'
    })

    await user.click(dropdownButton)

    const removeButton = screen.getByRole('button', {
      name: 'Filter granule'
    })
    await user.click(removeButton)

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      granuleId: 'one'
    })
  })

  test('clicking the filter button calls onExcludeGranule with a hashed id for CWIC collections', async () => {
    const { props, user } = setup({
      overrideProps: {
        row: {
          original: {
            id: 'one',
            isOpenSearch: true,
            dataLinks: [],
            s3Links: [],
            onlineAccessFlag: true,
            handleClick: vi.fn()
          }
        }
      }
    })

    const dropdownButton = screen.getByRole('button', {
      name: 'More actions'
    })

    await user.click(dropdownButton)

    const removeButton = screen.getByRole('button', {
      name: 'Filter granule'
    })
    await user.click(removeButton)

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      granuleId: '2257684172'
    })
  })

  test('clicking the add button calls addGranuleToProjectCollection and metricsAddGranuleToProject', async () => {
    const { props, user } = setup()

    const addGranuleButton = screen.getByRole('button', {
      name: 'Add granule to project'
    })

    await user.click(addGranuleButton)

    expect(props.column.customProps.addGranuleToProjectCollection).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.addGranuleToProjectCollection).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      granuleId: 'one'
    })

    expect(metricsAddGranuleToProject).toHaveBeenCalledTimes(1)
    expect(metricsAddGranuleToProject).toHaveBeenCalledWith({
      collectionConceptId: 'collectionId',
      granuleConceptId: 'one',
      page: 'granules',
      view: 'table'
    })
  })

  test('clicking the remove button calls removeGranuleFromProjectCollection', async () => {
    const { props, user } = setup({
      overrideProps: {
        column: {
          customProps: {
            ...defaultCustomProps,
            isGranuleInProject: vi.fn().mockReturnValue(true)
          }
        }
      }
    })

    const removeGranuleButton = screen.getByRole('button', {
      name: 'Remove granule from project'
    })

    await user.click(removeGranuleButton)

    expect(props.column.customProps.removeGranuleFromProjectCollection).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.removeGranuleFromProjectCollection).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      granuleId: 'one'
    })
  })

  describe('when the generate notebook tag is added', () => {
    test('renders the generate notebook dropdown', () => {
      setup({
        overrideProps: {
          column: {
            customProps: {
              ...defaultCustomProps,
              collectionTags: {
                'edsc.extra.serverless.notebook_generation': {
                  data: {
                    variable_concept_id: 'V123456789-TESTPROV'
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByRole('button', {
        name: 'Download sample notebook'
      })).toBeInTheDocument()
    })
  })
})
