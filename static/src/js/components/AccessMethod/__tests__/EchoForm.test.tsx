import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// @ts-expect-error: This file does not have types
import EDSCEchoform from '@edsc/echoforms'

import EchoForm from '../EchoForm'
// @ts-expect-error: This file does not have types
import { echoForm } from './mocks'

jest.mock('@edsc/echoforms', () => jest.fn(() => <div data-testid="edsc-echoforms" />))

function setup(overrideProps = {}) {
  const onUpdateAccessMethod = jest.fn()

  const props = {
    collectionId: '',
    form: '',
    methodKey: '',
    rawModel: '',
    shapefileId: null,
    spatial: {},
    temporal: {},
    ursProfile: {
      email_address: ''
    },
    onUpdateAccessMethod,
    ...overrideProps
  }

  const { rerender } = render(<EchoForm {...props} />)

  return {
    props,
    rerender,
    onUpdateAccessMethod
  }
}

describe('EchoForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render EDSCEchoform component', () => {
    setup()

    expect(screen.getByTestId('edsc-echoforms')).toBeInTheDocument()
  })

  test('renders an EDSCEchoform with spatial prepopulated', () => {
    setup({
      spatial: {
        polygon: ['-77,38,-77,38,-76,38,-77,38']
      }
    })

    expect(EDSCEchoform).toHaveBeenCalledWith(
      expect.objectContaining({
        prepopulateValues: expect.objectContaining({
          BBOX_EAST: -76,
          BBOX_NORTH: 38.00105844675541,
          BBOX_SOUTH: 37.99999999999998,
          BBOX_WEST: -77
        })
      }),
      {}
    )
  })

  test('renders an EDSCEchoform with temporal prepopulated', () => {
    setup({
      temporal: {
        endDate: '2020-03-05T17:49:07.369Z',
        startDate: '2019-12-06T07:34:12.613Z'
      }
    })

    expect(EDSCEchoform).toHaveBeenCalledWith(
      expect.objectContaining({
        prepopulateValues: expect.objectContaining({
          TEMPORAL_START: '2019-12-06T07:34:12',
          TEMPORAL_END: '2020-03-05T17:49:07'
        })
      }),
      {}
    )
  })

  test('renders an EDSCEchoform with email prepopulated', () => {
    setup({
      ursProfile: {
        email_address: 'test@example.com'
      }
    })

    expect(EDSCEchoform).toHaveBeenCalledWith(
      expect.objectContaining({
        prepopulateValues: expect.objectContaining({
          EMAIL: 'test@example.com'
        })
      }),
      {}
    )
  })

  test('renders an EDSCEchoform with a shapefile', () => {
    setup({
      shapefileId: '1234'
    })

    expect(EDSCEchoform).toHaveBeenCalledWith(
      expect.objectContaining({
        hasShapefile: true
      }),
      {}
    )
  })

  test('onFormModelUpdated calls onUpdateAccessMethod', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    const { onUpdateAccessMethod } = setup({
      collectionId,
      form: echoForm,
      methodKey
    })

    EDSCEchoform.mock.calls[0][0].onFormModelUpdated({
      model: 'new model',
      rawModel: 'new rawModel'
    })

    expect(onUpdateAccessMethod).toHaveBeenCalledTimes(1)
    expect(onUpdateAccessMethod).toHaveBeenCalledWith({
      collectionId,
      method: {
        echoOrder0: {
          model: 'new model',
          rawModel: 'new rawModel'
        }
      }
    })
  })

  test('onFormIsValidUpdated calls onUpdateAccessMethod', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    const { onUpdateAccessMethod } = setup({
      collectionId,
      form: echoForm,
      methodKey
    })

    EDSCEchoform.mock.calls[0][0].onFormIsValidUpdated(false)

    expect(onUpdateAccessMethod).toHaveBeenCalledTimes(1)
    expect(onUpdateAccessMethod).toHaveBeenCalledWith({
      collectionId,
      method: {
        echoOrder0: {
          isValid: false
        }
      }
    })
  })

  describe('when prepopulated values are reset', () => {
    describe('when the values are the same', () => {
      test('passes the correct values to the EchoForm', () => {
        const props = {
          spatial: {
            polygon: ['-77,38,-77,38,-76,38,-77,38']
          },
          temporal: {
            endDate: '2020-03-05T17:49:07.369Z',
            startDate: '2019-12-06T07:34:12.613Z'
          },
          ursProfile: {
            email_address: 'test@example.com'
          }
        }

        const { props: overriddenProps, rerender } = setup(props)

        expect(EDSCEchoform).toHaveBeenCalledTimes(1)

        rerender(<EchoForm {...overriddenProps} />)

        expect(EDSCEchoform).toHaveBeenCalledTimes(2)
        expect(EDSCEchoform).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            prepopulateValues: expect.objectContaining({
              BBOX_EAST: -76,
              BBOX_NORTH: 38.00105844675541,
              BBOX_SOUTH: 37.99999999999998,
              BBOX_WEST: -77,
              EMAIL: 'test@example.com',
              TEMPORAL_START: '2019-12-06T07:34:12',
              TEMPORAL_END: '2020-03-05T17:49:07'
            })
          }),
          {}
        )
      })
    })

    describe('when the values are not the same', () => {
      test('passes the correct values to the EchoForm', () => {
        const props = {
          spatial: {
            polygon: ['-77,38,-77,38,-76,38,-77,38']
          },
          temporal: {
            endDate: '2020-03-05T17:49:07.369Z',
            startDate: '2019-12-06T07:34:12.613Z'
          },
          ursProfile: {
            email_address: 'test@example.com'
          }
        }

        const { props: overriddenProps, rerender } = setup(props)

        expect(EDSCEchoform).toHaveBeenCalledTimes(1)

        const newProps = {
          ...overriddenProps,
          spatial: {
            polygon: ['-77,39,-77,38,-76,38,-77,38']
          }
        }

        rerender(<EchoForm {...newProps} />)

        expect(EDSCEchoform).toHaveBeenCalledTimes(3)
        expect(EDSCEchoform).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            prepopulateValues: expect.objectContaining({
              BBOX_EAST: -76,
              BBOX_NORTH: 39.000000000000014,
              BBOX_SOUTH: 37.99999999999998,
              BBOX_WEST: -77,
              EMAIL: 'test@example.com',
              TEMPORAL_START: '2019-12-06T07:34:12',
              TEMPORAL_END: '2020-03-05T17:49:07'
            })
          }),
          {}
        )
      })
    })
  })
})
