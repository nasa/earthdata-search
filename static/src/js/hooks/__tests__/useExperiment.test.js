import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import useExperiment from '../useExperiment'

Enzyme.configure({ adapter: new Adapter() })

window.setInterval = jest.fn((func) => func())
window.clearInterval = jest.fn()
window.console.warn = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  delete global.google_optimize
})

const TestComponent = ({ experimentId }) => {
  const variant = useExperiment(experimentId)

  return (
    <div className="test-component">
      {
        variant && (
          <>
            {'Variant: '}
            {variant}
          </>
        )
      }
      {
        variant === undefined && (
          'Variant is undefined'
        )
      }
    </div>
  )
}

function setup(overideProps) {
  const props = {
    experimentId: '',
    ...overideProps
  }

  const enzymeWrapper = mount(
    <TestComponent {...props} />
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('useExperiment', () => {
  describe('when the dataLayer is not defined', () => {
    const { dataLayer } = window

    beforeEach(() => {
      delete window.dataLayer
    })

    afterEach(() => {
      window.dataLayer = dataLayer
    })

    test('the variant returned is undefined', () => {
      window.dataLayer = undefined
      const { enzymeWrapper } = setup({
        experimentId: 'test-experiment-id'
      })

      expect(enzymeWrapper.find('.test-component').text()).toEqual('Variant is undefined')
    })
  })

  describe('when the dataLayer is defined', () => {
    const { push } = window.dataLayer
    afterEach(() => {
      window.dataLayer.push = push
    })

    describe('with no experiment defined', () => {
      test('the optimize.activate event is pushed to the dataLayer', () => {
        window.dataLayer.push = jest.fn()

        setup({
          experimentId: 'test-experiment-id'
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({ event: 'optimize.activate' })
      })

      test('returns undefined for the variant', async () => {
        window.dataLayer.push = jest.fn()

        const { enzymeWrapper } = await setup({
          experimentId: 'test-experiment-id'
        })

        expect(enzymeWrapper.find('.test-component').text()).toEqual('Variant is undefined')
      })
    })

    describe('when google_optimize is not defined', () => {
      test('the optimize.activate event is pushed to the dataLayer', () => {
        window.google_optimize = undefined
        window.dataLayer.push = jest.fn()

        setup({
          experimentId: 'test-experiment-id'
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({ event: 'optimize.activate' })
      })

      test('returns undefined for the variant', async () => {
        window.google_optimize = undefined
        window.dataLayer.push = jest.fn()

        const { enzymeWrapper } = await setup({
          experimentId: 'test-experiment-id'
        })

        expect(enzymeWrapper.find('.test-component').text()).toEqual('Variant is undefined')
      })
    })

    describe('when google_optimize is defined', () => {
      describe('with an invalid experiment defined', () => {
        test('returns undefined for the variant', async () => {
          // When trying to test without this mocked, the setInterval would not run
          window.setInterval = jest.fn((func) => func())

          window.google_optimize = {}
          window.google_optimize.get = jest.fn(() => undefined)

          const { enzymeWrapper } = await setup({
            experimentId: 'test-invalid-experiment-id'
          })

          expect(window.google_optimize.get).toHaveBeenCalledTimes(1)
          expect(window.google_optimize.get).toHaveBeenCalledWith('test-invalid-experiment-id')
          expect(enzymeWrapper.find('.test-component').text()).toEqual('Variant is undefined')
        })

        describe('when in development', () => {
          const nodeEnv = process.env.NODE_ENV
          beforeEach(() => {
            process.env.NODE_ENV = 'development'
          })
          afterEach(() => {
            process.env.NODE_ENV = nodeEnv
          })
          test('generates a warning', async () => {
            // When trying to test without this mocked, the setInterval would not run
            window.setInterval = jest.fn((func) => func())

            window.google_optimize = {}
            window.google_optimize.get = jest.fn(() => undefined)

            await setup({
              experimentId: 'test-invalid-experiment-id'
            })

            expect(console.warn).toHaveBeenCalledTimes(1)
            expect(console.warn).toHaveBeenCalledWith('No Google Optimize variant found for experiment "test-invalid-experiment-id". Make sure you are using a valid Experiment ID.')
          })
        })
      })

      describe('when in an env other than development', () => {
        const nodeEnv = process.env.NODE_ENV
        beforeEach(() => {
          process.env.NODE_ENV = 'production'
        })
        afterEach(() => {
          process.env.NODE_ENV = nodeEnv
        })
        test('does not generate a warning', async () => {
          // When trying to test without this mocked, the setInterval would not run
          window.setInterval = jest.fn((func) => func())

          window.google_optimize = {}
          window.google_optimize.get = jest.fn(() => undefined)

          await setup({
            experimentId: 'test-invalid-experiment-id'
          })

          expect(console.warn).toHaveBeenCalledTimes(0)
        })
      })

      describe('with a valid experiment defined', () => {
        test('returns the correct variant', async () => {
          // When trying to test without this mocked, the setInterval would not run
          window.setInterval = jest.fn((func) => func())

          window.google_optimize = {}
          window.google_optimize.get = jest.fn(() => '1')

          let enzymeWrapper

          await act(async () => {
            ({ enzymeWrapper } = await setup({
              experimentId: 'test-experiment-id'
            }))
          })

          expect(window.google_optimize.get).toHaveBeenCalledTimes(1)
          expect(window.google_optimize.get).toHaveBeenCalledWith('test-experiment-id')
          expect(enzymeWrapper.find('.test-component').text()).toEqual('Variant: 1')
        })

        test('clears the interval', async () => {
          // When trying to test without this mocked, the setInterval would not run
          window.google_optimize = {}
          window.google_optimize.get = jest.fn(() => '1')

          await act(async () => {
            await setup({
              experimentId: 'test-experiment-id'
            })
          })

          expect(window.clearInterval).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
