import * as Yup from 'yup'

import {
  getValidationSchema
} from '../forms'

jest.mock('yup', () => {
  const shapeMock = jest.fn()

  return {
    object: () => ({
      shape: shapeMock
    })
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getValidationSchema', () => {
  describe('when passed a single field', () => {
    test('should pass the right data to the validation function', () => {
      const validationMock = jest.fn()

      getValidationSchema([{
        name: 'testField',
        type: 'testField',
        validation: validationMock
      }])

      expect(Yup.object().shape).toHaveBeenCalledTimes(1)
      expect(Yup.object().shape).toHaveBeenCalledWith({
        testField: validationMock
      })
    })
  })

  describe('when passed a nested field', () => {
    test('should pass the right data to the validation function', () => {
      const validationMock1 = jest.fn()
      const validationMock2 = jest.fn()

      getValidationSchema([{
        name: 'testField',
        type: 'testField',
        fields: [
          {
            name: 'nestedField1',
            validation: validationMock1
          },
          {
            name: 'nestedField2',
            validation: validationMock2
          }]
      }])

      expect(Yup.object().shape).toHaveBeenCalledTimes(2)
      expect(Yup.object().shape.mock.calls[0]).toEqual([{
        nestedField1: validationMock1,
        nestedField2: validationMock2
      }])
      expect(Yup.object().shape.mock.calls[1]).toEqual([
        {
          testField: undefined
        }
      ])
    })
  })
})
