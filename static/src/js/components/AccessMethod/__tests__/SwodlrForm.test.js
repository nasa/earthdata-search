import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'

import SwodlrForm from '../SwodlrForm'

global.ResizeObserver = ResizeObserver

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrideProps) => {
  const setGranuleList = jest.fn()
  const onUpdateAccessMethod = jest.fn()

  const props = {
    granuleList: [
      {
        boxes: ['69.2764124 19.7592281 70.8859329 24.4776719'],
        browseFlag: true,
        id: 'G3161846518-POCLOUD',
        isOpenSearch: false,
        title: 'SWOT_L2_HR_Raster_250m_UTM34W_N_x_x_x_018_113_141F_20240713T230857_20240713T230911_PIC0_01',
        updated: '2024-07-17T09:48:54.667Z'
      }

    ],
    collectionId: 'collectionId',
    onUpdateAccessMethod,
    setGranuleList,
    selectedAccessMethod: 'swodlr',
    ...overrideProps
  }

  render(<SwodlrForm {...props} />)

  return {
    setGranuleList,
    onUpdateAccessMethod
  }
}

describe('SwodlrForm component', () => {
  test('can render', () => {
    setup()
    const swodlrText = screen.getByText('Granule Extent')
    expect(swodlrText).toBeInTheDocument()
  })

  // TODO maybe cant fire other one sine that is what is starts with
  describe('when the selected access method is swodlr', () => {
    test('selecting a granuleExtent calls onUpdateAccessMethod', async () => {
      const user = userEvent.setup()
      const { onUpdateAccessMethod } = setup()
      const granuleExtent256Checkbox = screen.getByRole('radio', { name: '256 x 128 km' })
      await user.click(granuleExtent256Checkbox)

      expect(onUpdateAccessMethod).toHaveBeenCalledTimes(2)
      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 90,
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: true
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: 0,
                  utmZoneAdjust: 0
                }
              }
            }
          }
        }
      })
      // TODO is this getting called twice because its in the useEffect?
    })

    // TODO this is not workign correctly in the test
    test('selecting a granuleExtent for 128km calls onUpdateAccessMethod', async () => {
      const user = userEvent.setup()
      const { onUpdateAccessMethod } = setup()
      const granuleExtent256Checkbox = screen.getByRole('radio', { name: '256 x 128 km' })
      await user.click(granuleExtent256Checkbox)

      const granuleExtent128Checkbox = await screen.findByRole('radio', { name: '128 x 128 km' })
      await user.click(granuleExtent128Checkbox)

      expect(onUpdateAccessMethod).toHaveBeenCalledTimes(3)
      // Ensure that the last call is using the correct parameters `outputGranuleExtentFlag` should be false
      expect(onUpdateAccessMethod.mock.calls[2][0]).toEqual({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 90,
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: 0,
                  utmZoneAdjust: 0
                }
              }
            }
          }
        }
      })
      // TODO is this getting called twice because its in the useEffect?
    })

    test('selecting a LAT/LON sampling grid type calls onUpdateAccessMethod with automatic rasterResolution value adjustment', async () => {
      const user = userEvent.setup()

      const { onUpdateAccessMethod } = setup()

      const latLonCheckbox = screen.getByRole('radio', { name: 'LAT/LON' })

      await user.click(latLonCheckbox)

      expect(onUpdateAccessMethod).toHaveBeenCalledTimes(2)
      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 3,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: null,
                  utmZoneAdjust: null
                }
              }
            }
          }
        }
      })
    })

    test('updating raster resolution calls onUpdateAccessMethod', async () => {
      const user = userEvent.setup()

      const { onUpdateAccessMethod } = setup()

      const rasterResolutionSelect = screen.getByRole('combobox', { name: 'rasterResolutionSelection' })

      await user.selectOptions(rasterResolutionSelect, '120')

      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData:
             {
               params: {
                 rasterResolution: 120,
                 outputSamplingGridType: 'UTM',
                 outputGranuleExtentFlag: false
               },
               custom_params: {
                 'G3161846518-POCLOUD': {
                   mgrsBandAdjust: 0,
                   utmZoneAdjust: 0
                 }
               }
             }
          }
        }
      })
    })

    test('rasterResolution options automatically update on sample grid type changes', async () => {
      const user = userEvent.setup()

      const { onUpdateAccessMethod } = setup()

      const latLonCheckbox = screen.getByRole('radio', { name: 'LAT/LON' })

      await user.click(latLonCheckbox)

      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 3,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: null,
                  utmZoneAdjust: null
                }
              }
            }
          }
        }
      })

      const utmCheckBox = screen.getByRole('radio', { name: 'UTM' })

      await user.click(utmCheckBox)

      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 90,
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: 0,
                  utmZoneAdjust: 0
                }
              }
            }
          }
        }
      })
    })

    describe('when updating individual granules UTM Zone Adjust', () => {
      test('updates utmZoneAdjust to `1 `calls onUpdateAccessMethod correctly', async () => {
        const user = userEvent.setup()
        const { setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByTestId('advancedOptionsToggle')
        await user.click(advancedOptionsToggleButton)

        const firstGranuleUTMZonePlusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-plus-1-UTM-zone' })
        await user.click(firstGranuleUTMZonePlusOne)

        expect(setGranuleList).toHaveBeenCalledWith([
          {
            boxes: [
              '69.2764124 19.7592281 70.8859329 24.4776719'
            ],
            browseFlag: true,
            id: 'G3161846518-POCLOUD',
            isOpenSearch: false,
            title: 'SWOT_L2_HR_Raster_250m_UTM34W_N_x_x_x_018_113_141F_20240713T230857_20240713T230911_PIC0_01',
            updated: '2024-07-17T09:48:54.667Z',
            utmZoneAdjust: 1
          }
        ])

        // Because the setGranuleList fn updates the granuleList, we can't check that the right value
        // was also used in the updateAccessCalled as they are chained together by the useEffect.
        expect(onUpdateAccessMethod).toHaveBeenCalledTimes(2)
        expect(onUpdateAccessMethod).toHaveBeenCalledWith({
          collectionId: 'collectionId',
          method: {
            swodlr: {
              swodlrData: {
                params: {
                  rasterResolution: 90,
                  outputSamplingGridType: 'UTM',
                  outputGranuleExtentFlag: false
                },
                custom_params: {
                  'G3161846518-POCLOUD': {
                    mgrsBandAdjust: 0,
                    utmZoneAdjust: 1
                  }
                }
              }
            }
          }
        })
      })

      test('updates utmZoneAdjust to `-1` calls onUpdateAccessMethod correctly', async () => {
        const user = userEvent.setup()
        const { setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByTestId('advancedOptionsToggle')
        await user.click(advancedOptionsToggleButton)

        const firstGranuleUTMZoneMinusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-minus-1-UTM-zone' })
        await user.click(firstGranuleUTMZoneMinusOne)

        expect(setGranuleList).toHaveBeenCalledWith([
          {
            boxes: [
              '69.2764124 19.7592281 70.8859329 24.4776719'
            ],
            browseFlag: true,
            id: 'G3161846518-POCLOUD',
            isOpenSearch: false,
            title: 'SWOT_L2_HR_Raster_250m_UTM34W_N_x_x_x_018_113_141F_20240713T230857_20240713T230911_PIC0_01',
            updated: '2024-07-17T09:48:54.667Z',
            utmZoneAdjust: -1
          }
        ])

        // Because the setGranuleList fn updates the granuleList, we can't check that the right value
        // was also used in the updateAccessCalled as they are chained together by the useEffect.
        expect(onUpdateAccessMethod).toHaveBeenCalledTimes(2)
        expect(onUpdateAccessMethod).toHaveBeenCalledWith({
          collectionId: 'collectionId',
          method: {
            swodlr: {
              swodlrData: {
                params: {
                  rasterResolution: 90,
                  outputSamplingGridType: 'UTM',
                  outputGranuleExtentFlag: false
                },
                custom_params: {
                  'G3161846518-POCLOUD': {
                    mgrsBandAdjust: 0,
                    utmZoneAdjust: -1
                  }
                }
              }
            }
          }
        })
      })

      // TODO this is only called once because its the default condition
      test('updates utmZoneAdjust to `0` calls onUpdateAccessMethod correctly', async () => {
        const user = userEvent.setup()
        const { onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByTestId('advancedOptionsToggle')
        await user.click(advancedOptionsToggleButton)

        const firstGranuleUTMZoneZero = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-0-UTM-zone' })
        await user.click(firstGranuleUTMZoneZero)
        // Expect(setGranuleList).toHaveBeenCalledWith([
        //   {
        //     boxes: [
        //       '69.2764124 19.7592281 70.8859329 24.4776719'
        //     ],
        //     browseFlag: true,
        //     id: 'G3161846518-POCLOUD',
        //     isOpenSearch: false,
        //     title: 'SWOT_L2_HR_Raster_250m_UTM34W_N_x_x_x_018_113_141F_20240713T230857_20240713T230911_PIC0_01',
        //     updated: '2024-07-17T09:48:54.667Z',
        //     utmZoneAdjust: 0
        //   }
        // ])

        // Because the setGranuleList fn updates the granuleList, we can't check that the right value
        // was also used in the updateAccessCalled as they are chained together by the useEffect.
        expect(onUpdateAccessMethod).toHaveBeenCalledTimes(1)
        expect(onUpdateAccessMethod).toHaveBeenCalledWith({
          collectionId: 'collectionId',
          method: {
            swodlr: {
              swodlrData: {
                params: {
                  rasterResolution: 90,
                  outputSamplingGridType: 'UTM',
                  outputGranuleExtentFlag: false
                },
                custom_params: {
                  'G3161846518-POCLOUD': {
                    mgrsBandAdjust: 0,
                    utmZoneAdjust: 0
                  }
                }
              }
            }
          }
        })
      })
    })

    test('can update individual granules MGRS Adjust', async () => {
      const user = userEvent.setup()
      const { setGranuleList, onUpdateAccessMethod } = setup()

      const advancedOptionsToggleButton = screen.getByTestId('advancedOptionsToggle')
      await user.click(advancedOptionsToggleButton)

      const firstGranuleUTMZonePlusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-plus-1-MGRS-band' })
      await user.click(firstGranuleUTMZonePlusOne)

      expect(setGranuleList).toHaveBeenCalledWith([
        {
          boxes: [
            '69.2764124 19.7592281 70.8859329 24.4776719'
          ],
          browseFlag: true,
          id: 'G3161846518-POCLOUD',
          isOpenSearch: false,
          title: 'SWOT_L2_HR_Raster_250m_UTM34W_N_x_x_x_018_113_141F_20240713T230857_20240713T230911_PIC0_01',
          updated: '2024-07-17T09:48:54.667Z',
          mgrsBandAdjust: 1
        }
      ])

      // TODO I think we can fix this
      // Because the setGranuleList fn updates the granuleList, we can't check that the right value
      // was also used in the updateAccessCalled as they are chained together by the useEffect.
      expect(onUpdateAccessMethod).toHaveBeenCalledTimes(2)
      expect(onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          swodlr: {
            swodlrData: {
              params: {
                rasterResolution: 90,
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3161846518-POCLOUD': {
                  mgrsBandAdjust: 1,
                  utmZoneAdjust: 0
                }
              }
            }
          }
        }
      })
    })
  })
})
