import setupTest from '../../../../../../vitestConfigs/setupTest'

import Spinner from '../Spinner'
import Dots from '../Dots'

vi.mock('../Dots', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: Spinner
})

describe('Spinner component', () => {
  describe('when rendering the "dots" type', () => {
    test('renders the Dots component', () => {
      setup({
        overrideProps: {
          type: 'dots',
          inline: true,
          size: 'small',
          color: 'white',
          className: 'test-class'
        }
      })

      expect(Dots).toHaveBeenCalledTimes(1)
      expect(Dots).toHaveBeenCalledWith({
        className: 'test-class',
        color: 'white',
        dataTestId: null,
        inline: true,
        label: 'Loading...',
        size: 'small'
      }, {})
    })

    test('renders the Dots component with defaults', () => {
      setup({
        overrideProps: {
          type: 'dots'
        }
      })

      expect(Dots).toHaveBeenCalledTimes(1)
      expect(Dots).toHaveBeenCalledWith({
        className: null,
        color: '',
        dataTestId: null,
        inline: false,
        label: 'Loading...',
        size: ''
      }, {})
    })

    test('renders nothing when an unknown type is provided', () => {
      const { container } = setup({
        overrideProps: {
          type: 'unknown'
        }
      })

      expect(container.innerHTML).toBe('')
    })
  })
})
