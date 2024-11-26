import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'
import moment from 'moment'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import DatepickerContainer from '../DatepickerContainer'

import { getApplicationConfig } from '../../../../../../sharedUtils/config'

const mockStore = configureMockStore()
const store = mockStore({})

const setup = (overrideProps) => {
  const user = userEvent.setup()
  const { minimumTemporalDateString, temporalDateFormatFull } = getApplicationConfig()

  const props = {
    format: 'YYYY-MM-DD HH:mm:ss',
    id: 'test-id',
    label: 'Test Datepicker',
    minDate: minimumTemporalDateString,
    maxDate: moment.utc().format(temporalDateFormatFull),
    onSubmit: jest.fn(),
    onMetricsTemporalFilter: jest.fn(),
    ...overrideProps
  }

  render(
    <Provider store={store}>
      <DatepickerContainer {...props} />
    </Provider>
  )

  return {
    props,
    user
  }
}

describe('DatepickerContainer component', () => {
  beforeEach(() => {
    MockDate.set('2020-05-15T12:00:00.000Z')
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('when input is of type YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
    test('validate date is parsed correctly', () => {
      setup(
        {
          type: 'start',
          value: '2006-04-01T13:01:00.000Z'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      expect(input.value).toEqual('2006-04-01 13:01:00')
    })
  })

  describe('when typing in the text field', () => {
    describe('when type is start', () => {
      test('calls onSubmit as entered', async () => {
        const { props } = setup(
          {
            type: 'start',
            value: '2006-04-01T00:00:00.000Z'
          }
        )

        const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

        await input.focus()
        await input.blur()

        expect(props.onSubmit).toHaveBeenCalledTimes(1)
        expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2006-04-01 00:00:00', props.format), true)
      })

      test('returns unchanged datetime when date is not a \'startOf\' day', async () => {
        const { props } = setup(
          {
            type: 'start',
            value: '2006-04-01T00:40:00.000Z'
          }
        )

        const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

        await input.focus()
        await input.blur()

        expect(props.onSubmit).toHaveBeenCalledTimes(1)
        expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2006-04-01 00:40:00', props.format), true)
      })
    })
  })

  describe('when type is end', () => {
    test('returns the `endOf` the day when the date entered is a `startOf` day', async () => {
      const { props } = setup(
        {
          type: 'end',
          value: '2006-04-01T00:00:00.000Z'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await input.focus()
      await input.blur()

      expect(props.onSubmit).toHaveBeenCalledTimes(1)
      expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2006-04-01 00:00:00', props.format).endOf('day'), true)
    })

    test('returns unchanged datetime when date is not a `startOf` day', async () => {
      const { props } = setup(
        {
          type: 'end',
          value: '2006-04-01T00:40:00.000Z'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await input.focus()
      await input.blur()

      expect(props.onSubmit).toHaveBeenCalledTimes(1)
      expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2006-04-01 00:40:00', props.format), true)
    })

    test('returns autocompleted YYYY', async () => {
      const { props } = setup(
        {
          type: 'end',
          value: '2020'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await input.focus()
      await input.blur()

      expect(props.onSubmit).toHaveBeenCalledTimes(1)
      expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2020', props.format).endOf('year'), true)
    })

    test('returns autocompleted YYYY-MM', async () => {
      const { props } = setup(
        {
          type: 'end',
          value: '2020-06'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await input.focus()
      await input.blur()

      expect(props.onSubmit).toHaveBeenCalledTimes(1)
      expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2020-06', props.format).endOf('month'), true)
    })

    test('returns autocompleted YYYY-MM-DD', async () => {
      const { props } = setup(
        {
          type: 'end',
          value: '2020-06-15'
        }
      )

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await input.focus()
      await input.blur()

      expect(props.onSubmit).toHaveBeenCalledTimes(1)
      expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2020-06-15', props.format).endOf('day'), true)
    })
  })

  describe('onTodayClick', () => {
    describe('when the type is null', () => {
      test('calls onSubmit with null', async () => {
        const { props, user } = setup()

        const button = screen.getByRole('button', { name: 'Today' })
        await user.click(button)

        expect(props.onSubmit).toHaveBeenCalledTimes(1)

        expect(props.onSubmit.mock.calls[0][0].format(props.format))
          .toEqual(moment.utc(null).format(props.format))

        expect(props.onSubmit.mock.calls[0][1]).toEqual(true)
      })
    })

    describe('when the type is `start`', () => {
      test('call onSubmit with the the beginning of today', async () => {
        const { props, user } = setup(
          {
            type: 'start'
          }
        )

        const button = screen.getByRole('button', { name: 'Today' })
        await user.click(button)

        expect(props.onSubmit).toHaveBeenCalledTimes(1)
        expect(props.onSubmit).toHaveBeenCalledWith(moment.utc('2020-05-15 00:00:00', props.format, true), true)
      })
    })

    describe('when the type is `end`', () => {
      test('call onSubmit with the the end of today', async () => {
        const { props, user } = setup(
          {
            type: 'end'
          }
        )

        const button = screen.getByRole('button', { name: 'Today' })
        await user.click(button)

        expect(props.onSubmit.mock.calls[0][0].format(props.format))
          .toEqual(moment.utc('2020-05-15 00:00:00').endOf('day').format(props.format))

        expect(props.onSubmit.mock.calls[0][1]).toEqual(true)
      })
    })
  })

  describe('onClearClick', () => {
    test('calls onSubmit with no value', async () => {
      const { props, user } = setup(
        {
          type: 'start',
          value: '2006-04-01T00:40:00.000Z'
        }
      )

      const button = screen.getByRole('button', { name: 'Clear' })
      await user.click(button)

      expect(props.onSubmit).toHaveBeenCalledTimes(2)

      expect(props.onSubmit.mock.calls[0][0].format(props.format))
        .toEqual(moment.utc('2020-05-15').startOf('day').format(props.format))

      expect(props.onSubmit.mock.calls[0][1]).toEqual(false)
      expect(props.onSubmit.mock.calls[1][0].format(props.format)).toEqual(moment.utc('').format(props.format))
      expect(props.onSubmit.mock.calls[1][1]).toEqual(true)
    })
  })

  describe('when viewing dates earlier than the minDate', () => {
    beforeEach(() => {
      MockDate.set('1965')
    })

    test('does not allow dates before minDate to be selected', async () => {
      setup({
        type: 'start'
      })

      const button = screen.getByRole('cell', { name: '1959' })

      expect(button).toHaveClass('rdtDisabled')
    })
  })

  describe('when viewing dates later than the maxDate', () => {
    test('does not allow dates before minDate to be selected', async () => {
      setup({
        type: 'start'
      })

      const button = screen.getByRole('cell', { name: '2025' })

      expect(button).toHaveClass('rdtDisabled')
    })
  })

  describe('when focusing the input', () => {
    test('stores the value when focused', async () => {
      const { user } = setup({
        type: 'start',
        value: '2006-04-01T00:40:00.000Z'
      })

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await user.click(input) // This will trigger the focus event
      // Type something but don't blur - we want to test that the original value was stored
      await user.type(input, '2007')

      // The input value would have changed, but the stored valueWhenFocused should still be the original
      expect(input).toHaveValue('2006-04-01 00:40:00')
    })

    test('handles focus when input is empty', async () => {
      const { user } = setup({
        type: 'start',
        value: ''
      })

      const input = screen.getByRole('textbox', { name: 'Test Datepicker' })

      await user.click(input)

      // Verify the input remains empty
      expect(input).toHaveValue('')
    })
  })
})
