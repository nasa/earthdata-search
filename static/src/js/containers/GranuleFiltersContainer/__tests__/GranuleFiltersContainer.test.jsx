import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { GranuleFiltersContainer } from '../GranuleFiltersContainer'

import GranuleFiltersForm from '../../../components/GranuleFilters/GranuleFiltersForm'

vi.mock('../../../components/GranuleFilters/GranuleFiltersForm', () => ({
  default: vi.fn(() => null)
}))

const setup = setupTest({
  Component: GranuleFiltersContainer,
  defaultProps: {
    errors: {},
    granuleFiltersNeedsReset: false,
    handleBlur: vi.fn(),
    handleChange: vi.fn(),
    handleReset: vi.fn(),
    handleSubmit: vi.fn(),
    setFieldTouched: vi.fn(),
    setFieldValue: vi.fn(),
    setGranuleFiltersNeedReset: vi.fn(),
    touched: {},
    values: {}
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId'
    },
    query: {
      changeGranuleQuery: vi.fn()
    }
  },
  withRouter: true
})

describe('GranuleFiltersContainer component', () => {
  test('renders the GranuleFiltersForm', () => {
    setup()

    expect(GranuleFiltersForm).toHaveBeenCalledTimes(1)
    expect(GranuleFiltersForm).toHaveBeenCalledWith({
      errors: {},
      handleBlur: expect.any(Function),
      handleChange: expect.any(Function),
      handleSubmit: expect.any(Function),
      setFieldTouched: expect.any(Function),
      setFieldValue: expect.any(Function),
      touched: {},
      values: {}
    }, {})
  })

  describe('GranuleFiltersForm', () => {
    describe('when the component is updated', () => {
      describe('when the granuleFiltersNeedsReset flag is set to true', () => {
        test('calls changeGranuleQuery and handleReset', () => {
          const { props, zustandState } = setup({
            overrideProps: {
              granuleFiltersNeedsReset: true
            }
          })

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'collectionId',
            query: {}
          })

          expect(props.handleReset).toHaveBeenCalledTimes(1)
          expect(props.handleReset).toHaveBeenCalledWith()
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        test('does not call changeGranuleQuery and handleReset', () => {
          const { props, zustandState } = setup()

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(0)
          expect(props.handleReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test('handle submit is called', async () => {
        const { props } = setup({
          overrideProps: {
            values: {
              mock: 'data'
            }
          }
        })

        GranuleFiltersForm.mock.calls[0][0].handleSubmit()

        await waitFor(() => {
          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        })

        expect(props.handleSubmit).toHaveBeenCalledWith({
          mock: 'data'
        })
      })
    })
  })
})
