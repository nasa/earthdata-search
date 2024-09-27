import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ResizeObserver from 'resize-observer-polyfill'

import SwodlrForm from '../SwodlrForm'

global.ResizeObserver = ResizeObserver

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrideProps) => {
  const setGranuleList = jest.fn()
  const onUpdateAccessMethod = jest.fn()
  const user = userEvent.setup()
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
    user,
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

  describe('when the selected access method is swodlr', () => {
    test('selecting a granuleExtent calls onUpdateAccessMethod', async () => {
      const { user, onUpdateAccessMethod } = setup()
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
    })

    test('selecting a granuleExtent for 128km calls onUpdateAccessMethod', async () => {
      const { user, onUpdateAccessMethod } = setup()
      const granuleExtent256Checkbox = screen.getByRole('radio', { name: '256 x 128 km' })
      const granuleExtent128Checkbox = await screen.findByRole('radio', { name: '128 x 128 km' })

      // Click 128 x 128 after selecting because it is the default
      await user.click(granuleExtent256Checkbox)
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
    })

    test('selecting a LAT/LON sampling grid type calls onUpdateAccessMethod with automatic rasterResolution value adjustment', async () => {
      const { user, onUpdateAccessMethod } = setup()
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

      expect(screen.getByText('arc-seconds')).toBeInTheDocument()
    })

    test('updating raster resolution calls onUpdateAccessMethod', async () => {
      const { user, onUpdateAccessMethod } = setup()

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
      const { user, onUpdateAccessMethod } = setup()

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

      expect(screen.getByText('meters')).toBeInTheDocument()
    })

    describe('when updating individual granules UTM Zone Adjust', () => {
      test('updates utmZoneAdjust to `1 `calls onUpdateAccessMethod correctly', async () => {
        const { user, setGranuleList, onUpdateAccessMethod } = setup()
        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        const firstGranuleUTMZonePlusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-plus-1-UTM-zone' })

        await user.click(firstGranuleUTMZonePlusOne)

        expect(setGranuleList).toHaveBeenCalledTimes(1)
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
        const { user, setGranuleList, onUpdateAccessMethod } = setup()
        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        const firstGranuleUTMZoneMinusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-minus-1-UTM-zone' })

        await user.click(firstGranuleUTMZoneMinusOne)

        expect(setGranuleList).toHaveBeenCalledTimes(1)
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

      test('updates utmZoneAdjust to `0` calls onUpdateAccessMethod correctly', async () => {
        const { user, setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        // Set to negative 1 first since 0 is the default
        const firstGranuleUTMZoneMinusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-minus-1-UTM-zone' })

        await user.click(firstGranuleUTMZoneMinusOne)

        const firstGranuleUTMZoneZero = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-0-UTM-zone' })

        await user.click(firstGranuleUTMZoneZero)

        expect(setGranuleList).toBeCalledTimes(2)
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
            utmZoneAdjust: 0
          }
        ])

        // Once during onMount and twice in the user actions
        expect(onUpdateAccessMethod).toHaveBeenCalledTimes(3)
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
      })
    })

    describe('when updating individual granules MGRS Adjust', () => {
      test('updates MGRS to `1 `calls onUpdateAccessMethod correctly', async () => {
        const { user, setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        const firstGranuleMGRSPlusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-plus-1-MGRS-band' })

        await user.click(firstGranuleMGRSPlusOne)

        expect(setGranuleList).toHaveBeenCalledTimes(1)
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

      test('updates MGRS to `-1 `calls onUpdateAccessMethod correctly', async () => {
        const { user, setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        const firstGranuleMGRSMinusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-minus-1-MGRS-band' })

        await user.click(firstGranuleMGRSMinusOne)

        expect(setGranuleList).toHaveBeenCalledTimes(1)
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
            mgrsBandAdjust: -1
          }
        ])

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
                    mgrsBandAdjust: -1,
                    utmZoneAdjust: 0
                  }
                }
              }
            }
          }
        })
      })

      test('updates MGRS to `0 `calls onUpdateAccessMethod correctly', async () => {
        const { user, setGranuleList, onUpdateAccessMethod } = setup()

        const advancedOptionsToggleButton = screen.getByRole('button', { name: 'Open Panel' })

        await user.click(advancedOptionsToggleButton)

        const firstGranuleMGRSMinusOne = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-minus-1-MGRS-band' })

        await user.click(firstGranuleMGRSMinusOne)

        const firstGranuleMGRSZero = screen.getByRole('radio', { name: 'G3161846518-POCLOUD-0-MGRS-band' })

        await user.click(firstGranuleMGRSZero)

        expect(setGranuleList).toBeCalledTimes(2)
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
            mgrsBandAdjust: 0
          }
        ])

        expect(onUpdateAccessMethod).toHaveBeenCalledTimes(3)
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
      })
    })
  })
})
