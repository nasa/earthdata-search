import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import SubscriptionsQueryList from '../SubscriptionsQueryList'

const setup = setupTest({
  Component: SubscriptionsQueryList,
  defaultProps: {
    disabledFields: {},
    displayEmptyMessage: false,
    query: {},
    setDisabledFields: jest.fn(),
    showCheckboxes: false,
    subscriptionType: 'granule'
  }
})

describe('SubscriptionsQueryList component', () => {
  describe('when displayEmptyMessage is true and the query is empty', () => {
    test('should render the empty state message', () => {
      setup({
        overrideProps: {
          displayEmptyMessage: true,
          query: {}
        }
      })

      expect(screen.getByText('This subscription has no search filters applied.')).toBeInTheDocument()
    })
  })

  describe('when querying collections with granules', () => {
    test('does not render the label', () => {
      setup({
        overrideProps: {
          query: {
            hasGranulesOrCwic: true
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.queryByText('Collections without granules')).not.toBeInTheDocument()
    })
  })

  describe('when querying collections without granules', () => {
    test('should render the label', () => {
      setup({
        overrideProps: {
          subscriptionType: 'collection',
          query: {}
        }
      })

      expect(screen.getByText('Include datasets without granules')).toBeInTheDocument()
    })
  })

  describe('when displaying a query with a temporal range', () => {
    test('should render the label', () => {
      setup({
        overrideProps: {
          query: {
            temporal: '2000-01-01T10:00:00Z,2010-03-10T12:00:00Z'
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByText('Start: 2000-01-01 10:00:00')).toBeInTheDocument()
      expect(screen.getByText('End: 2010-03-10 12:00:00')).toBeInTheDocument()
    })
  })

  describe('when displaying a query with a bounding box', () => {
    test('should render the label', () => {
      setup({
        overrideProps: {
          query: {
            boundingBox: ['2,1,4,3']
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByText('SW: 1, 2')).toBeInTheDocument()
      expect(screen.getByText('NE: 3, 4')).toBeInTheDocument()
    })
  })

  describe('when displaying a query with a circle', () => {
    test('should render the label', () => {
      setup({
        overrideProps: {
          query: {
            circle: ['2,1,3']
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByText('Center: 1, 2')).toBeInTheDocument()
      expect(screen.getByText('Radius (m): 3')).toBeInTheDocument()
    })
  })

  describe('when displaying a query with a hierarchy', () => {
    test('should render the label', () => {
      setup({
        overrideProps: {
          query: {
            scienceKeywordsH: [{
              detailed_variable: 'detailed_variable',
              term: 'term',
              topic: 'topic',
              variable_level_1: 'variable_level_1',
              variable_level_2: 'variable_level_2',
              variable_level_3: 'variable_level_3'
            }]
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByText('topic > term > variable_level_1 > variable_level_2 > variable_level_3 > detailed_variable')).toBeInTheDocument()
    })
  })

  describe('when rendering a query property that does not exist in the mapping', () => {
    test('renders the key', () => {
      setup({
        overrideProps: {
          query: {
            something: 'test'
          },
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByText('something')).toBeInTheDocument()
    })
  })

  describe('when rendering a query property that does exist in the mapping', () => {
    test('renders the humanized vaules', () => {
      setup({
        overrideProps: {
          subscriptionType: 'collection',
          query: {
            polygon: ['1,1,1,0,0,0,0,1']
          }
        }
      })

      expect(screen.getByText('Polygon')).toBeInTheDocument()
    })
  })

  describe('when showCheckboxes is true', () => {
    test('displays the checkbox', () => {
      setup({
        overrideProps: {
          query: {
            hasGranulesOrCwic: true,
            keyword: 'modis*'
          },
          showCheckboxes: true,
          subscriptionType: 'collection'
        }
      })

      expect(screen.getByRole('checkbox')).toHaveAttribute('checked')
    })

    test('displays the checkbox unchecked when the field is disabled', () => {
      setup({
        overrideProps: {
          disabledFields: {
            keyword: true
          },
          query: {
            hasGranulesOrCwic: true,
            keyword: 'modis*'
          },
          showCheckboxes: true
        }
      })

      expect(screen.getByRole('checkbox')).not.toHaveAttribute('checked')
    })

    test('handleCheckboxChange calls setDisabledFields', async () => {
      const { props, user } = setup({
        overrideProps: {
          subscriptionType: 'collection',
          query: {
            hasGranulesOrCwic: true,
            keyword: 'modis*'
          },
          showCheckboxes: true
        }
      })

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(props.setDisabledFields).toHaveBeenCalledTimes(1)
      expect(props.setDisabledFields).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
