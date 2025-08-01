import useEdscStore from '../../../zustand/useEdscStore'
import handleFormSubmit from '../handleFormSubmit'

const setSubmittingMock = jest.fn()

describe('handleFormSubmit', () => {
  describe('when passing new values', () => {
    test('calls onApplyGranuleFilters witht the correct values', () => {
      useEdscStore.setState({
        query: {
          changeGranuleQuery: jest.fn()
        }
      })

      const values = {
        test: 'value',
        readableGranuleName: ''
      }

      const config = {
        props: {
          collectionMetadata: {
            conceptId: 'collectionId'
          }
        },
        setSubmitting: setSubmittingMock
      }

      handleFormSubmit(values, config)

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      expect(query.changeGranuleQuery).toHaveBeenCalledTimes(1)
      expect(query.changeGranuleQuery).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        query: {
          readableGranuleName: '',
          test: 'value'
        }
      })

      expect(setSubmittingMock).toHaveBeenCalledTimes(1)
      expect(setSubmittingMock).toHaveBeenCalledWith(false)
    })
  })

  describe('when readableGranuleName is defined', () => {
    test('splits the value on the comma', () => {
      useEdscStore.setState({
        query: {
          changeGranuleQuery: jest.fn()
        }
      })

      const values = {
        readableGranuleName: '1,2,3'
      }

      const config = {
        props: {
          collectionMetadata: {
            conceptId: 'collectionId'
          }
        },
        setSubmitting: setSubmittingMock
      }

      handleFormSubmit(values, config)

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      expect(query.changeGranuleQuery).toHaveBeenCalledTimes(1)
      expect(query.changeGranuleQuery).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        query: { readableGranuleName: ['1', '2', '3'] }
      })

      expect(setSubmittingMock).toHaveBeenCalledTimes(1)
      expect(setSubmittingMock).toHaveBeenCalledWith(false)
    })
  })
})
