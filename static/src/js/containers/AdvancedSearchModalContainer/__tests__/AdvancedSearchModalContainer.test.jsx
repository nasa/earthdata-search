import setupTest from '../../../../../../vitestConfigs/setupTest'

import { AdvancedSearchModalContainer } from '../AdvancedSearchModalContainer'
import AdvancedSearchModal from '../../../components/AdvancedSearchModal/AdvancedSearchModal'

vi.mock('../../../components/AdvancedSearchModal/AdvancedSearchModal', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: AdvancedSearchModalContainer,
  defaultProps: {
    isValid: true,
    errors: {},
    fields: [],
    handleBlur: vi.fn(),
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    resetForm: vi.fn(),
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    touched: {},
    values: {},
    validateForm: vi.fn()
  }
})

describe('AdvancedSearchModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    setup()

    expect(AdvancedSearchModal).toHaveBeenCalledTimes(1)
    expect(AdvancedSearchModal).toHaveBeenCalledWith({
      errors: {},
      fields: [],
      handleBlur: expect.any(Function),
      handleChange: expect.any(Function),
      handleSubmit: expect.any(Function),
      isValid: true,
      resetForm: expect.any(Function),
      setFieldTouched: expect.any(Function),
      setFieldValue: expect.any(Function),
      touched: {},
      validateForm: expect.any(Function),
      values: {}
    }, {})
  })
})
