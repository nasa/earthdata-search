import handleFormSubmit from '../handleFormSubmit'

const onApplyGranuleFiltersMock = jest.fn()
const setSubmittingMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handleFormSubmit', () => {
  describe('when passing new values', () => {
    test('calls onApplyGranuleFilters witht the correct values', () => {
      const values = {
        test: 'value',
        readableGranuleName: ''
      }

      const config = {
        props: {
          onApplyGranuleFilters: onApplyGranuleFiltersMock
        },
        setSubmitting: setSubmittingMock
      }

      handleFormSubmit(values, config)

      expect(onApplyGranuleFiltersMock).toHaveBeenCalledTimes(1)
      expect(onApplyGranuleFiltersMock).toHaveBeenCalledWith(values)
    })
  })

  describe('when readableGranuleName is defined', () => {
    test('splits the value on the comma', () => {
      const values = {
        readableGranuleName: '1,2,3'
      }

      const config = {
        props: {
          onApplyGranuleFilters: onApplyGranuleFiltersMock
        },
        setSubmitting: setSubmittingMock
      }

      handleFormSubmit(values, config)

      expect(onApplyGranuleFiltersMock).toHaveBeenCalledTimes(1)
      expect(onApplyGranuleFiltersMock).toHaveBeenCalledWith({
        readableGranuleName: ['1', '2', '3']
      })
    })
  })
})
