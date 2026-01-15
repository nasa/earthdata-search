import MockDate from 'mockdate'

import InputRange from 'react-input-range'
import Alert from 'react-bootstrap/Alert'

import setupTest from '../../../../../../jestConfigs/setupTest'

import TemporalSelection from '../TemporalSelection'
import DatepickerContainer from '../../../containers/DatepickerContainer/DatepickerContainer'

jest.mock('../../../containers/DatepickerContainer/DatepickerContainer', () => jest.fn(() => null))

jest.mock('react-bootstrap/Alert', () => jest.fn(() => null))
jest.mock('react-input-range', () => jest.fn(() => null))

const setup = setupTest({
  Component: TemporalSelection,
  defaultProps: {
    controlId: 'test-id',
    temporal: {},
    onRecurringToggle: jest.fn(),
    onChangeRecurring: jest.fn(),
    onSubmitStart: jest.fn(),
    onSubmitEnd: jest.fn(),
    onInvalid: jest.fn(),
    onValid: jest.fn(),
    onSliderChange: jest.fn(),
    viewMode: 'years'
  }
})

beforeEach(() => {
  // Set a mock date so that maxDate calculations are consistent
  MockDate.set('2026-01-10T00:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('TemporalSelection component', () => {
  test('when passed a start date renders DatePickerContainer component correctly', () => {
    const { props } = setup({
      overrideProps: {
        displayStartDate: '2019-03-30T00:00:00.000Z',
        displayEndDate: ''
      }
    })

    // Each DatepickerContainer is called twice due to initial render and state update in useEffect
    expect(DatepickerContainer).toHaveBeenCalledTimes(4)
    const startDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__start-date',
      label: 'Start Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitStart,
      shouldValidate: true,
      size: '',
      type: 'start',
      value: '2019-03-30T00:00:00.000Z',
      viewMode: 'years'
    }
    const endDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__end-date',
      label: 'End Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitEnd,
      shouldValidate: true,
      size: '',
      type: 'end',
      value: '',
      viewMode: 'years'
    }

    expect(DatepickerContainer).toHaveBeenNthCalledWith(1, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(2, endDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(3, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(4, endDateProps, {})
  })

  test('when passed a end date renders DatePickerContainer component correctly', () => {
    const { props } = setup({
      overrideProps: {
        displayStartDate: '',
        displayEndDate: '2019-03-30T00:00:00.000Z'
      }
    })

    // Each DatepickerContainer is called twice due to initial render and state update in useEffect
    expect(DatepickerContainer).toHaveBeenCalledTimes(4)
    const startDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__start-date',
      label: 'Start Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitStart,
      shouldValidate: true,
      size: '',
      type: 'start',
      value: '',
      viewMode: 'years'
    }
    const endDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__end-date',
      label: 'End Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitEnd,
      shouldValidate: true,
      size: '',
      type: 'end',
      value: '2019-03-30T00:00:00.000Z',
      viewMode: 'years'
    }

    expect(DatepickerContainer).toHaveBeenNthCalledWith(1, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(2, endDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(3, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(4, endDateProps, {})
  })

  test('when passed a both start and end dates renders DatePickerContainer components correctly', () => {
    const { props } = setup({
      overrideProps: {
        displayStartDate: '2019-03-29T00:00:00.000Z',
        displayEndDate: '2019-03-30T00:00:00.000Z'
      }
    })

    // Each DatepickerContainer is called twice due to initial render and state update in useEffect
    expect(DatepickerContainer).toHaveBeenCalledTimes(4)
    const startDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__start-date',
      label: 'Start Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitStart,
      shouldValidate: true,
      size: '',
      type: 'start',
      value: '2019-03-29T00:00:00.000Z',
      viewMode: 'years'
    }
    const endDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__end-date',
      label: 'End Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitEnd,
      shouldValidate: true,
      size: '',
      type: 'end',
      value: '2019-03-30T00:00:00.000Z',
      viewMode: 'years'
    }

    expect(DatepickerContainer).toHaveBeenNthCalledWith(1, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(2, endDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(3, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(4, endDateProps, {})
  })

  test('when passed a start date after the end date renders DatePickerContainer components correctly', () => {
    const { props } = setup({
      overrideProps: {
        displayStartDate: '2019-03-30T00:00:00.000Z',
        displayEndDate: '2019-03-29T00:00:00.000Z'
      }
    })

    // Each DatepickerContainer is called twice due to initial render and state update in useEffect
    expect(DatepickerContainer).toHaveBeenCalledTimes(4)
    const startDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__start-date',
      label: 'Start Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitStart,
      shouldValidate: true,
      size: '',
      type: 'start',
      value: '2019-03-30T00:00:00.000Z',
      viewMode: 'years'
    }
    const endDateProps = {
      filterType: 'granule',
      format: 'YYYY-MM-DD HH:mm:ss',
      id: 'test-id__temporal-form__end-date',
      label: 'End Date',
      maxDate: '2026-01-10T00:00:00.000Z',
      minDate: '1960-01-01 00:00:00',
      onSubmit: props.onSubmitEnd,
      shouldValidate: true,
      size: '',
      type: 'end',
      value: '2019-03-29T00:00:00.000Z',
      viewMode: 'years'
    }

    expect(DatepickerContainer).toHaveBeenNthCalledWith(1, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(2, endDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(3, startDateProps, {})
    expect(DatepickerContainer).toHaveBeenNthCalledWith(4, endDateProps, {})
  })

  test('when passed a start date after the end date calls onInvalid and renders Alert', () => {
    const { props } = setup({
      overrideProps: {
        temporal: {
          startDate: '2019-03-30T00:00:00.000Z',
          endDate: '2019-03-29T00:00:00.000Z'
        }
      }
    })

    expect(props.onValid).toHaveBeenCalledTimes(0)

    expect(props.onInvalid).toHaveBeenCalledTimes(1)
    expect(props.onInvalid).toHaveBeenCalledWith()

    // Each Alert is called twice due to initial render and state update in useEffect
    expect(Alert).toHaveBeenCalledTimes(4)
    // Start Date Alert
    expect(Alert).toHaveBeenNthCalledWith(1, expect.objectContaining({
      show: true
    }), {})

    // End Date Alert
    expect(Alert).toHaveBeenNthCalledWith(2, expect.objectContaining({
      show: false
    }), {})

    // Start Date Alert
    expect(Alert).toHaveBeenNthCalledWith(3, expect.objectContaining({
      show: true
    }), {})

    // End Date Alert
    expect(Alert).toHaveBeenNthCalledWith(4, expect.objectContaining({
      show: false
    }), {})
  })

  test('when passed a start date before the end date calls onValid and renders Alert', () => {
    const { props } = setup({
      overrideProps: {
        temporal: {
          startDate: '2019-03-29T00:00:00.000Z',
          endDate: '2019-03-30T00:00:00.000Z'
        }
      }
    })

    expect(props.onValid).toHaveBeenCalledTimes(1)
    expect(props.onValid).toHaveBeenCalledWith()

    expect(props.onInvalid).toHaveBeenCalledTimes(0)

    // Each Alert is called twice due to initial render and state update in useEffect
    expect(Alert).toHaveBeenCalledTimes(4)
    // Start Date Alert
    expect(Alert).toHaveBeenNthCalledWith(1, expect.objectContaining({
      show: false
    }), {})

    // End Date Alert
    expect(Alert).toHaveBeenNthCalledWith(2, expect.objectContaining({
      show: false
    }), {})

    // Start Date Alert
    expect(Alert).toHaveBeenNthCalledWith(3, expect.objectContaining({
      show: false
    }), {})

    // End Date Alert
    expect(Alert).toHaveBeenNthCalledWith(4, expect.objectContaining({
      show: false
    }), {})
  })

  test('onChangeRecurring is only called when input is complete on InputRange', () => {
    const { props } = setup({
      overrideProps: {
        temporal: {
          startDate: '2019-01-01T00:00:00.000Z',
          endDate: '2020-01-01T00:00:00.000Z',
          isRecurring: true
        },
        allowRecurring: true
      }
    })

    const inputRange = InputRange.mock.calls[0][0]

    // Simulate onChange event
    inputRange.onChange({
      min: 2018,
      max: 2021
    })

    // Verify onSliderChange was called for both dates
    expect(props.onSliderChange).toHaveBeenCalledTimes(1)
    expect(props.onSliderChange).toHaveBeenCalledWith(
      {
        max: 2021,
        min: 2018
      }
    )

    // Verify onChangeRecurring was not called during onChange
    expect(props.onChangeRecurring).toHaveBeenCalledTimes(0)

    jest.clearAllMocks()

    inputRange.onChangeComplete({
      min: 2018,
      max: 2021
    })

    // Verify onChangeRecurring was called only once with the new range
    expect(props.onChangeRecurring).toHaveBeenCalledTimes(1)
    expect(props.onChangeRecurring).toHaveBeenCalledWith({
      min: 2018,
      max: 2021
    })

    expect(props.onSliderChange).toHaveBeenCalledTimes(0)
  })
})
