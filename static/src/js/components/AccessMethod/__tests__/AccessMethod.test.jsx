import React from 'react'

import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import AccessMethod from '../AccessMethod'
import AccessMethodRadio from '../../FormFields/AccessMethodRadio/AccessMethodRadio'
import Skeleton from '../../Skeleton/Skeleton'

import useEdscStore from '../../../zustand/useEdscStore'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import EchoForm from '../EchoForm'

import { radioListItemSkeleton } from '../../FormFields/AccessMethodRadio/skeleton'

import {
  harmonyAccessMethod,
  echoForm,
  rawModel,
  opendapAccessMethod
} from './__mocks__/mocks'

vi.mock('../../Skeleton/Skeleton', () => ({ default: vi.fn(() => <div />) }))

vi.mock('../../FormFields/AccessMethodRadio/AccessMethodRadio', async () => ({
  default: vi.fn().mockImplementation(
    (await vi.importActual('../../FormFields/AccessMethodRadio/AccessMethodRadio')).AccessMethodRadio
  )
}))

// Mock the Swodlr max value so the mock objects don't get so large in the tests
vi.mock('../../../constants/swodlrConstants', async () => ({
  ...(await vi.importActual('../../../constants/swodlrConstants')),
  maxSwodlrGranuleCount: 2
}))

vi.mock('../EchoForm', () => ({ default: vi.fn(() => <div />) }))

const emptySpatial = {
  boundingBox: [],
  circle: [],
  line: [],
  point: [],
  polygon: []
}

const setup = setupTest({
  Component: AccessMethod,
  defaultProps: {
    accessMethods: {},
    index: 0,
    isActive: true,
    metadata: {},
    shapefileId: null,
    spatial: emptySpatial,
    temporal: {},
    ursProfile: {},
    overrideTemporal: {},
    onSelectAccessMethod: vi.fn(),
    onUpdateAccessMethod: vi.fn(),
    projectCollection: {
      granules: {}
    },
    selectedAccessMethod: ''
  },
  defaultZustandState: {
    map: {
      showMbr: false,
      setShowMbr: vi.fn()
    },
    projectPanels: {
      setActivePanel: vi.fn()
    }
  }
})

describe('AccessMethod component', () => {
  describe('handleAccessMethodSelection', () => {
    test('updates the selected access method when download is selected', async () => {
      const collectionId = 'collectionId'
      const { props, user } = setup({
        overrideProps: {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          metadata: {
            conceptId: collectionId,
            granule_count: 10000
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      await user.click(directDownloadAccessMethodRadioButton)

      expect(props.onSelectAccessMethod).toHaveBeenCalledTimes(1)
      expect(props.onSelectAccessMethod).toHaveBeenCalledWith({
        collectionId,
        selectedAccessMethod: 'download'
      })
    })

    test('updates the selected access method when Customize Download is selected', async () => {
      const collectionId = 'collectionId'
      const { props, user } = setup({
        overrideProps: {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            harmony: harmonyAccessMethod
          },
          metadata: {
            conceptId: collectionId,
            granule_count: 10000
          }
        }
      })

      const customizeDownloadAccessMethodRadioButton = screen.getByRole('radio', { name: 'Customize Download Select from the parameters below to customize your download' })
      await user.click(customizeDownloadAccessMethodRadioButton)

      expect(props.onSelectAccessMethod).toHaveBeenCalledTimes(1)
      expect(props.onSelectAccessMethod).toHaveBeenCalledWith({
        collectionId,
        selectedAccessMethod: 'harmony'
      })
    })

    describe('handleAccessMethodSelection', () => {
      test('when there is no access method', async () => {
        const collectionId = 'collectionId'
        setup({
          overrideProps: {
            accessMethods: {},
            metadata: {
              conceptId: collectionId,
              granule_count: 10000
            }
          }
        })

        const noAccessMethodAlert = screen.getByText('No access methods exist for this collection.')
        expect(noAccessMethodAlert).toBeInTheDocument()
      })

      test('when access methods are loading', async () => {
        setup({
          overrideZustandState: {
            project: {
              collections: {
                isLoading: true
              }
            }
          }
        })

        expect(Skeleton).toHaveBeenCalledTimes(4)

        expect(Skeleton).toHaveBeenNthCalledWith(1, expect
          .objectContaining({ shapes: radioListItemSkeleton }), {})

        expect(Skeleton).toHaveBeenNthCalledWith(2, expect
          .objectContaining({ shapes: radioListItemSkeleton }), {})

        expect(Skeleton).toHaveBeenNthCalledWith(3, expect
          .objectContaining({ shapes: radioListItemSkeleton }), {})

        expect(Skeleton).toHaveBeenNthCalledWith(4, expect
          .objectContaining({ shapes: radioListItemSkeleton }), {})
      })
    })

    test('updates the selected access method when type is orderable', async () => {
      const collectionId = 'collectionId'
      const { props, user } = setup({
        overrideProps: {
          accessMethods: {
            esi0: {
              isValid: true,
              type: 'ESI'
            }
          },
          metadata: {
            conceptId: collectionId,
            granule_count: 10000
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      await user.click(directDownloadAccessMethodRadioButton)

      expect(props.onSelectAccessMethod).toHaveBeenCalledTimes(1)

      // Multiple `ESI` services are possible for a collection
      expect(props.onSelectAccessMethod).toHaveBeenCalledWith({
        collectionId,
        selectedAccessMethod: 'esi0'
      })
    })
  })

  describe('radio button display', () => {
    test('renders a radio button for download', () => {
      setup({
        overrideProps: {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      expect(directDownloadAccessMethodRadioButton.value).toEqual('download')
    })

    test('renders a radio button for echo orders', () => {
      setup({
        overrideProps: {
          accessMethods: {
            echoOrder0: {
              isValid: true,
              type: 'ECHO ORDERS'
            }
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      expect(directDownloadAccessMethodRadioButton.value).toEqual('echoOrder0')
    })

    test('renders a radio button for esi', () => {
      setup({
        overrideProps: {
          accessMethods: {
            esi: {
              isValid: true,
              type: 'ESI'
            }
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      expect(directDownloadAccessMethodRadioButton.value).toEqual('esi')
    })

    test('renders a radio button for opendap', () => {
      setup({
        overrideProps: {
          accessMethods: {
            opendap: {
              isValid: true,
              type: 'OPeNDAP'
            }
          }
        }
      })

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      expect(directDownloadAccessMethodRadioButton.value).toEqual('opendap')
    })

    test('renders a radio button for harmony', () => {
      setup({
        overrideProps: {
          accessMethods: {
            harmony: harmonyAccessMethod
          }
        }
      })

      // Called twice due to rerender from useEffect()
      expect(AccessMethodRadio).toHaveBeenCalledTimes(2)
      expect(AccessMethodRadio).toHaveBeenNthCalledWith(1, expect.objectContaining({
        checked: false,
        description: 'Select from the parameters below to customize your download',
        details: 'Select options like variables, transformations, and output formats by applying parameters. Data will be staged in the cloud for download and analysis.',
        disabled: false,
        errorMessage: '',
        externalLink: {
          link: 'https://harmony.earthdata.nasa.gov/',
          message: 'What is Harmony?'
        },
        isLoading: undefined,
        id: 'undefined_access-method__harmony_type',
        title: 'Customize Download',
        value: 'harmony'
      }), {})

      expect(AccessMethodRadio).toHaveBeenNthCalledWith(2, expect.objectContaining({
        checked: false,
        description: 'Select from the parameters below to customize your download',
        details: 'Select options like variables, transformations, and output formats by applying parameters. Data will be staged in the cloud for download and analysis.',
        disabled: false,
        errorMessage: '',
        externalLink: {
          link: 'https://harmony.earthdata.nasa.gov/',
          message: 'What is Harmony?'
        },
        isLoading: undefined,
        id: 'undefined_access-method__harmony_type',
        title: 'Customize Download',
        value: 'harmony'
      }), {})

      const directDownloadAccessMethodRadioButton = screen.getByRole('radio')
      expect(directDownloadAccessMethodRadioButton.value).toEqual('harmony')
    })
  })

  describe('Selected Access Method: Echo Forms/Echo Orders', () => {
    test('lazy loads the echo-forms component and provides the correct fallback', async () => {
      const collectionId = 'collectionId'

      setup({
        overrideProps: {
          accessMethods: {
            echoOrder0: {
              isValid: true,
              type: 'ECHO ORDERS',
              form: echoForm
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'echoOrder0'
        }
      })

      // Spinner up before the lazy loaded component has completed loading
      expect(screen.getByTestId('access-method-echoform-spinner')).toBeInTheDocument()

      // Wait for the lazy loaded component to load with the mocked implementation
      await waitFor(() => expect(EchoForm).toHaveBeenCalledTimes(1))
      expect(EchoForm).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        form: echoForm,
        methodKey: 'echoOrder0',
        onUpdateAccessMethod: expect.any(Function),
        rawModel: null,
        spatial: emptySpatial,
        temporal: {}
      }, {})
    })

    test('renders an echoform with saved fields', async () => {
      const collectionId = 'collectionId'

      setup({
        overrideProps: {
          accessMethods: {
            echoOrder0: {
              isValid: true,
              type: 'ECHO ORDERS',
              form: echoForm,
              rawModel
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'echoOrder0'
        }
      })

      // TODO this gets called once if ran with `.only` vitest is not clearing this correctly between
      // this and the other `echoform` tests
      await waitFor(() => {
        expect(EchoForm).toHaveBeenCalledTimes(2)
      })

      expect(EchoForm).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        form: echoForm,
        methodKey: 'echoOrder0',
        onUpdateAccessMethod: expect.any(Function),
        rawModel,
        spatial: emptySpatial,
        temporal: {}
      }, {})
    })
  })

  describe('Selected Access Method: OPeNDAP', () => {
    test('selecting a output format calls onUpdateAccessMethod', async () => {
      const collectionId = 'collectionId'
      const { props, user } = setup({
        overrideProps: {
          accessMethods: {
            opendap: opendapAccessMethod
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'opendap'
        }
      })

      expect(screen.getByRole('option', { name: 'Default Format' }).selected).toBe(true)
      expect(screen.getByRole('option', { name: 'Default Format' }).value).toBe('')

      const selectElement = screen.getByTestId('access-methods__output-format-options')

      await user.selectOptions(selectElement, 'nc4')

      expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
        collectionId: 'collectionId',
        method: {
          opendap: {
            selectedOutputFormat: 'nc4'
          }
        }
      })
    })

    describe('Variables Subsetting', () => {
      describe('when variables subsetting is supported', () => {
        describe('and when variables is an empty object', () => {
          test('displays meaningful message', () => {
            const collectionId = 'collectionId'

            setup({
              overrideProps: {
                accessMethods: {
                  opendap: {
                    ...opendapAccessMethod,
                    variables: {}
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'opendap'
              }
            })

            expect(screen.getByText('No variables available for selected item.')).toBeInTheDocument()
            expect(screen.queryByText(/variables selected/)).not.toBeInTheDocument()
            expect(screen.queryByRole('button', { name: 'Edit Variables' })).not.toBeInTheDocument()
          })
        })

        describe('and when variables is a populated object', () => {
          test('displays Edit Variables Button', () => {
            const collectionId = 'collectionId'

            setup({
              overrideProps: {
                accessMethods: {
                  opendap: opendapAccessMethod
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'opendap'
              }
            })

            expect(screen.getByRole('button', { name: 'Edit Variables' })).toBeInTheDocument()
          })
        })

        describe('when the variables have been selected', () => {
          test('displays the number of selected variables', async () => {
            const selectedVariables = ['V1233612363-E2E_18_4']
            setup({
              overrideProps: {
                accessMethods: {
                  opendap: {
                    ...opendapAccessMethod,
                    selectedVariables
                  }
                },
                selectedAccessMethod: 'opendap'
              }
            })

            // Check if the text indicating the number of selected variables is present
            expect(screen.getByText(`${selectedVariables.length} variable selected`)).toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('Selected Access Method: SWODLR', () => {
    describe('when the selected access method is swodlr', () => {
      describe('when there are less than 10 granules', () => {
        test('SWODLR Option displayed', async () => {
          const collectionId = 'collectionId'
          setup({
            overrideProps: {
              accessMethods: {
                swodlr: {
                  type: 'SWODLR',
                  supportsSwodlr: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'swodlr',
              projectCollection: {
                isVisible: true,
                granules: {
                  addedGranuleIds: [
                    'G10000000000-EDSC',
                    'G1000000001-EDSC'
                  ],
                  byId: {
                    'G10000000000-EDSC': {
                      id: 'G10000000000-EDSC'
                    },
                    'G1000000001-EDSC': {
                      id: 'G1000000001-EDSC'
                    }
                  }
                }
              }
            }
          })

          const swodlrText = await screen.findByText('Granule Extent')
          expect(swodlrText).toBeInTheDocument()
        })

        describe('when the granule list contains undefined values', () => {
          test('does not load the SWODLR form', async () => {
            const collectionId = 'C1000000000-EDSC'
            setup({
              overrideProps: {
                accessMethods: {
                  swodlr: {
                    type: 'SWODLR',
                    supportsSwodlr: true
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'swodlr',
                projectCollection: {
                  isVisible: true,
                  granules: {
                    addedGranuleIds: [
                      'G1000000000-EDSC',
                      'G1000000001-EDSC',
                      'G1000000002-EDSC'
                    ],
                    byId: {}
                  }
                }
              }
            })

            await waitFor(() => {
              const swodlrText = screen.queryByText('Granule Extent')

              // The swodlr form will not load
              expect(swodlrText).not.toBeInTheDocument()
            })
          })
        })
      })

      describe('when there are more than 10 granules', () => {
        test('SWODLR Options do not display', async () => {
          const collectionId = 'C1000000000-EDSC'
          setup({
            overrideProps: {
              accessMethods: {
                swodlr: {
                  type: 'SWODLR',
                  supportsSwodlr: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'swodlr',
              projectCollection: {
                isVisible: true,
                granules: {
                  addedGranuleIds: [
                    'G1000000000-EDSC',
                    'G1000000001-EDSC',
                    'G1000000002-EDSC'
                  ],
                  byId: {}
                }
              }
            },
            overrideZustandState: {
              granule: {
                granuleMetadata: {
                  'G1000000000-EDSC': {
                    id: 'G1000000000-EDSC'
                  },
                  'G1000000001-EDSC': {
                    id: 'G1000000001-EDSC'
                  },
                  'G1000000002-EDSC': {
                    id: 'G1000000002-EDSC'
                  }
                }
              }
            }
          })

          await waitFor(() => {
            const swodlrText = screen.queryByText('Granule Extent')

            // The swodlr form will not load
            expect(swodlrText).not.toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('Selected Access Method: Harmony', () => {
    test('sets the checkbox checked in Step 1 for "Customize Download"', () => {
      const collectionId = 'collectionId'
      setup({
        overrideProps: {
          accessMethods: {
            harmony: harmonyAccessMethod
          },
          selectedAccessMethod: 'harmony',
          metadata: {
            conceptId: collectionId
          }
        }
      })

      const harmonyTypeInput = screen.getByTestId('collectionId_access-method__harmony_type')

      const radioInput = within(harmonyTypeInput).getByRole('radio')
      expect(radioInput.checked).toBe(true)
    })

    describe('Spatial Subsetting', () => {
      describe('when supportsSpatialSubsetting is set to false', () => {
        describe('when a spatial range is not set', () => {
          test('does not display the spatial subsetting input', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    supportsSpatialSubsetting: false
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                spatial: {}
              }
            })

            // Ensure that `Spatial Subsetting` is not being rendered on the DOM
            expect(screen.queryByText('Spatial Subsetting')).toBeNull()
          })
        })

        describe('when a spatial range is set', () => {
          test('does not display the spatial subsetting input', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    supportsSpatialSubsetting: false
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                spatial: {
                  ...emptySpatial,
                  boundingBox: ['-18.28125,-25.8845,-10.40625,-14.07468']
                }
              }
            })

            // Ensure that `Spatial Subsetting` is not being rendered on the DOM
            expect(screen.queryByText('Spatial Subsetting')).toBeNull()
          })
        })
      })

      describe('when supportsSpatialSubsetting is set to true', () => {
        describe('when enableSpatialSubsetting is set to false', () => {
          test('sets the checkbox unchecked for boundingBox', () => {
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: 'collectionId'
                },
                selectedAccessMethod: 'harmony',
                spatial: {
                  ...emptySpatial,
                  boundingBox: ['-18.28125,-25.8845,-10.40625,-14.07468']
                }
              }
            })

            expect(screen.getByRole('checkbox', { name: 'Trim output granules to the selected spatial constraint' }).checked).toEqual(false)
          })

          test('no area selected shows up when not passing in a spatial value', () => {
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: 'collectionId'
                },
                selectedAccessMethod: 'harmony',
                spatial: {}
              }
            })

            expect(screen.getByText('No spatial area selected. Make a spatial selection to enable spatial subsetting.')).toBeInTheDocument()
          })

          describe('when the user clicks the checkbox for spatial subsetting', () => {
            test('calls onUpdateAccessMethod and updates enableSpatialSubsetting to true', async () => {
              const collectionId = 'collectionId'
              const { props, user } = setup({
                overrideProps: {
                  accessMethods: {
                    harmony: harmonyAccessMethod
                  },
                  metadata: {
                    conceptId: collectionId
                  },
                  selectedAccessMethod: 'harmony',
                  spatial: {
                    ...emptySpatial,
                    boundingBox: ['-18.28125,-25.8845,-10.40625,-14.07468']
                  }
                }
              })

              const checkbox = screen.getByRole('checkbox', { name: 'Trim output granules to the selected spatial constraint' })
              expect(checkbox.checked).toEqual(false)

              await user.click(checkbox)

              expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
              expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
                collectionId: 'collectionId',
                method: {
                  harmony: {
                    enableSpatialSubsetting: true
                  }
                }
              })
            })

            describe('when the user provided point spatial and the harmony service does not support shapefile subsetting', () => {
              test('displays a warning and a bounding box Selected Area', async () => {
                setup({
                  overrideProps: {
                    accessMethods: {
                      harmony: {
                        ...harmonyAccessMethod,
                        supportsShapefileSubsetting: false
                      }
                    },
                    metadata: {
                      conceptId: 'collectionId'
                    },
                    selectedAccessMethod: 'harmony',
                    spatial: {
                      ...emptySpatial,
                      point: ['82.6875,-18.61541']
                    }
                  }
                })

                // First alert is always there and tells users about parameters becoming disabled.
                const mbrWarning = screen.getAllByRole('alert')
                expect(mbrWarning[1]).toHaveTextContent('Only bounding boxes are supported. Your point has been automatically converted into the bounding box shown above and outlined on the map.')

                const zustandState = useEdscStore.getState()
                const { map } = zustandState
                const { setShowMbr } = map
                expect(setShowMbr).toHaveBeenCalledTimes(1)
                expect(setShowMbr).toHaveBeenNthCalledWith(1, true)
              })
            })

            describe('when the user provided circle spatial and the harmony service does not support shapefile subsetting', () => {
              test('displays a warning and a bounding box Selected Area', async () => {
                setup({
                  overrideProps: {
                    accessMethods: {
                      harmony: {
                        ...harmonyAccessMethod,
                        supportsShapefileSubsetting: false
                      }
                    },
                    metadata: {
                      conceptId: 'collectionId'
                    },
                    selectedAccessMethod: 'harmony',
                    spatial: {
                      ...emptySpatial,
                      circle: ['64.125,7.8161,983270-18.28125']
                    }
                  }
                })

                // First alert is always there and tells users about parameters becoming disabled.
                const mbrWarning = screen.getAllByRole('alert')
                expect(mbrWarning[1]).toHaveTextContent('Only bounding boxes are supported. Your circle has been automatically converted into the bounding box shown above and outlined on the map.')

                const zustandState = useEdscStore.getState()
                const { map } = zustandState
                const { setShowMbr } = map
                expect(setShowMbr).toHaveBeenCalledTimes(1)
                expect(setShowMbr).toHaveBeenNthCalledWith(1, true)
              })
            })

            describe('when the user provided line spatial and the harmony service does not support shapefile subsetting', () => {
              test('displays a warning and a bounding box Selected Area', async () => {
                setup({
                  overrideProps: {
                    accessMethods: {
                      harmony: {
                        ...harmonyAccessMethod,
                        supportsShapefileSubsetting: false
                      }
                    },
                    metadata: {
                      conceptId: 'collectionId'
                    },
                    selectedAccessMethod: 'harmony',
                    spatial: {
                      ...emptySpatial,
                      line: ['82.6875,-18.61541,83.1231, -16.11311']
                    }
                  }
                })

                // First alert is always there and tells users about parameters becoming disabled.
                const mbrWarning = screen.getAllByRole('alert')
                expect(mbrWarning[1]).toHaveTextContent('Only bounding boxes are supported. Your line has been automatically converted into the bounding box shown above and outlined on the map.')

                const zustandState = useEdscStore.getState()
                const { map } = zustandState
                const { setShowMbr } = map
                expect(setShowMbr).toHaveBeenCalledTimes(1)
                expect(setShowMbr).toHaveBeenNthCalledWith(1, true)
              })
            })

            describe('when the user provided polygon spatial and the harmony service does not support shapefile subsetting', () => {
              test('displays a warning and a bounding box Selected Area', async () => {
                setup({
                  overrideProps: {
                    accessMethods: {
                      harmony: {
                        ...harmonyAccessMethod,
                        supportsShapefileSubsetting: false
                      }
                    },
                    metadata: {
                      conceptId: 'collectionId'
                    },
                    selectedAccessMethod: 'harmony',
                    spatial: {
                      ...emptySpatial,
                      polygon: ['104.625,-10.6875,103.11328,-10.89844,103.57031,-12.19922,105.32813,-13.11328,106.38281,-11.70703,105.75,-10.33594,104.625,-10.6875']
                    }
                  }
                })

                // First alert is always there and tells users about parameters becoming disabled.
                const mbrWarning = screen.getAllByRole('alert')
                expect(mbrWarning[1]).toHaveTextContent('Only bounding boxes are supported. Your polygon has been automatically converted into the bounding box shown above and outlined on the map.')

                const zustandState = useEdscStore.getState()
                const { map } = zustandState
                const { setShowMbr } = map
                expect(setShowMbr).toHaveBeenCalledTimes(1)
                expect(setShowMbr).toHaveBeenNthCalledWith(1, true)
              })
            })
          })
        })
      })
    })

    describe('Temporal Subsetting', () => {
      describe('when temporal subsetting is not supported', () => {
        describe('when a temporal range is not set', () => {
          test('does not display the temporal subsetting input', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    supportsTemporalSubsetting: false,
                    enableTemporalSubsetting: false
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {}
              }
            })

            // Ensure that `Temporal Subsetting` is not being rendered on the DOM
            expect(screen.queryByText('Temporal Subsetting')).toBeNull()
          })
        })

        describe('when a temporal range is set', () => {
          test('it does not shows the temporal subsetting range', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    supportsTemporalSubsetting: false
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {
                  startDate: '2008-06-27T00:00:00.979Z',
                  endDate: '2021-08-01T23:59:59.048Z',
                  isRecurring: false
                }
              }
            })

            expect(screen.queryByText('Selected Range:2008-06-27 00:00:00 to 2021-08-01 23:59:59')).not.toBeInTheDocument()
          })
        })
      })

      describe('when temporal subsetting is supported', () => {
        describe('when a temporal range is not set', () => {
          test('displays a message about temporal subsetting', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {}
              }
            })

            expect(screen.getByText('No temporal range selected. Make a temporal selection to enable temporal subsetting.')).toBeInTheDocument()
          })
        })

        describe('when a temporal range is set', () => {
          test('displays a checkbox input', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {
                  startDate: '2008-06-27T00:00:00.979Z',
                  endDate: '2021-08-01T23:59:59.048Z',
                  isRecurring: false
                }
              }
            })

            // One single temporal subsetting selection
            expect(screen.getAllByRole('checkbox', { name: 'Trim output granules to the selected temporal constraint' }).length).toEqual(1)
          })

          describe('when only an start date is set', () => {
            test('displays the correct selected temporal range', () => {
              const collectionId = 'collectionId'
              setup({
                overrideProps: {
                  accessMethods: {
                    harmony: harmonyAccessMethod
                  },
                  metadata: {
                    conceptId: collectionId
                  },
                  selectedAccessMethod: 'harmony',
                  temporal: {
                    startDate: '2008-06-27T00:00:00.979Z',
                    isRecurring: false
                  }
                }
              })

              expect(screen.getByText('Selected Range:2008-06-27 00:00:00 to Present')).toBeInTheDocument()
            })

            describe('when only an end date is set', () => {
              test('displays the correct selected temporal range', () => {
                const collectionId = 'collectionId'
                setup({
                  overrideProps: {
                    accessMethods: {
                      harmony: harmonyAccessMethod
                    },
                    metadata: {
                      conceptId: collectionId
                    },
                    selectedAccessMethod: 'harmony',
                    temporal: {
                      endDate: '2008-06-27T00:00:00.979Z',
                      isRecurring: false
                    }
                  }
                })

                expect(screen.getByText('Selected Range:Up to 2008-06-27 00:00:00')).toBeInTheDocument()
              })
            })
          })
        })

        describe('when the temporal selection is recurring', () => {
          test('disables checkbox and shows error', async () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {
                  startDate: '2008-06-27T00:00:00.979Z',
                  endDate: '2021-08-01T23:59:59.048Z',
                  recurringDayStart: 0,
                  recurringDayEnd: 10,
                  isRecurring: true
                }
              }
            })

            expect(screen.getByRole('checkbox', { name: 'Trim output granules to the selected temporal constraint' })).toBeDisabled()
            expect(screen.getByText('To prevent unexpected results, temporal subsetting is not supported for recurring dates.')).toBeInTheDocument()
          })
        })

        describe('when enableTemporalSubsetting is set to false', () => {
          test('defaults the checkbox to unchecked', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: harmonyAccessMethod
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {
                  startDate: '2008-06-27T00:00:00.979Z',
                  endDate: '2021-08-01T23:59:59.048Z',
                  isRecurring: false
                }
              }
            })

            expect(screen.getByRole('checkbox', { name: 'Trim output granules to the selected temporal constraint' }).checked).toEqual(false)
          })
        })

        describe('when enableTemporalSubsetting is set to true', () => {
          test('sets the checkbox checked', () => {
            const collectionId = 'collectionId'
            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    enableTemporalSubsetting: true
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony',
                temporal: {
                  startDate: '2008-06-27T00:00:00.979Z',
                  endDate: '2021-08-01T23:59:59.048Z',
                  isRecurring: false
                }
              }
            })

            expect(screen.getByRole('checkbox', { name: 'Trim output granules to the selected temporal constraint' }).checked).toEqual(true)
          })

          describe('when the user clicks the checkbox', () => {
            test('calls onUpdateAccessMethod and updates enableTemporalSubsetting to false', async () => {
              const collectionId = 'collectionId'
              const { props, user } = setup({
                overrideProps: {
                  accessMethods: {
                    harmony: {
                      ...harmonyAccessMethod,
                      enableTemporalSubsetting: true
                    }
                  },
                  metadata: {
                    conceptId: collectionId
                  },
                  selectedAccessMethod: 'harmony',
                  temporal: {
                    startDate: '2008-06-27T00:00:00.979Z',
                    endDate: '2021-08-01T23:59:59.048Z',
                    isRecurring: false
                  }
                }
              })

              const checkbox = screen.getByRole('checkbox', { name: 'Trim output granules to the selected temporal constraint' })

              // Ensure `checkbox` is true first
              expect(checkbox.checked).toEqual(true)

              await user.click(checkbox)

              expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
              expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
                collectionId: 'collectionId',
                method: {
                  harmony: {
                    enableTemporalSubsetting: false
                  }
                }
              })
            })
          })
        })
      })
    })

    describe('Output Formats', () => {
      describe('when supportedOutputFormats is an empty array (not supported)', () => {
        test('does not display outputFormat field', () => {
          const collectionId = 'collectionId'
          setup({
            overrideProps: {
              accessMethods: {
                harmony: {
                  ...harmonyAccessMethod,
                  supportedOutputFormats: []
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          const selectElement = screen.queryByTestId('access-methods__output-format-options')

          expect(selectElement).not.toBeInTheDocument()
        })
      })

      describe('when supportedOutputFormats is a populated array (supported)', () => {
        test('displays outputFormat field', async () => {
          const collectionId = 'collectionId'

          setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          await expect(screen.getByText('Choose from output format options like GeoTIFF, NETCDF, and other file types.')).toBeInTheDocument()

          expect(screen.getByTestId('access-methods__output-format-options')).toBeInTheDocument()
        })

        test('selecting an output format calls onUpdateAccessMethod', async () => {
          const collectionId = 'collectionId'
          const { props, user } = setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          const option = await screen.findByRole('option', { name: 'NETCDF-4' })

          await user.selectOptions(
            screen.getByTestId('access-methods__output-format-options'),
            option
          )

          expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
            collectionId: 'collectionId',
            method: {
              harmony: { selectedOutputFormat: 'application/netcdf' }
            }
          })
        })

        describe('when supportedOutputFormats contains options that are disabled', () => {
          test('disables those options in dropdown', async () => {
            const collectionId = 'collectionId'

            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    outputFormatAvailability: { 'NETCDF-4': false }
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony'
              }
            })

            await waitFor(() => {
              expect(screen.getByText('Choose from output format options like GeoTIFF, NETCDF, and other file types.')).toBeInTheDocument()
            })

            expect(screen.getByRole('option', { name: 'NETCDF-4' })).toBeDisabled()
          })
        })
      })
    })

    describe('Output Projections', () => {
      describe('when supportedOutputProjections is an empty array (not supported)', () => {
        test('does not display outputFormat field', () => {
          const collectionId = 'collectionId'
          setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod,
                supportedOutputProjections: []
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          const selectElement = screen.queryByTestId('access-methods__output-projection')

          expect(selectElement).not.toBeInTheDocument()
        })
      })

      describe('when supportedOutputProjections exist (supported)', () => {
        test('displays outputProjection field', async () => {
          const collectionId = 'collectionId'
          setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          await expect(screen.getByText('Choose a desired output projection from supported EPSG Codes.')).toBeInTheDocument()

          expect(screen.getByTestId('access-methods__output-projection-options')).toBeInTheDocument()
        })

        test('selecting a output projection calls onUpdateAccessMethod', async () => {
          const collectionId = 'collectionId'
          const { props, user } = setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          const option = await screen.findByRole('option', { name: 'EPGS:4313 | Geographic' })
          await user.selectOptions(
            screen.getByTestId('access-methods__output-projection-options'),
            option
          )

          expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
            collectionId: 'collectionId',
            method: {
              harmony: {
                selectedOutputProjection: 'EPGS:4313'
              }
            }
          })
        })

        describe('when supportedOutputFormats contains options that are disabled', () => {
          test('disables those options in dropdown', async () => {
            const collectionId = 'collectionId'

            setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    outputProjectionAvailability: { Geographic: false }
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony'
              }
            })

            const option = await screen.findByRole('option', { name: 'EPGS:4313 | Geographic' })

            expect(option).toBeDisabled()
          })
        })
      })
    })

    describe('Concatenate', () => {
      describe('when a service does not support concatenation', () => {
        test('Combine Data box is absent', () => {
          const collectionId = 'collectionId'
          setup({
            overrideProps: {
              accessMethods: {
                harmony: harmonyAccessMethod
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          expect(screen.queryByText(/Combine Data/)).not.toBeInTheDocument()
        })
      })

      describe('when a service supports concatenation', () => {
        test('Combine Data box is populated', () => {
          const collectionId = 'collectionId'
          const concatCheckboxName = 'Enable Concatenation Data will be concatenated along a newly created dimension'
          setup({
            overrideProps: {
              accessMethods: {
                harmony: {
                  ...harmonyAccessMethod,
                  supportsConcatenation: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony'
            }
          })

          expect(screen.getByText(/Combine Data/)).toBeInTheDocument()

          expect(screen.getByRole('checkbox', { name: concatCheckboxName }).checked).toEqual(false)
        })

        describe('when a user checks the checkbox for concatenation', () => {
          test('updates enableConcateDownload to true with on', async () => {
            const collectionId = 'collectionId'
            const concatCheckboxName = 'Enable Concatenation Data will be concatenated along a newly created dimension'
            const { user, props } = setup({
              overrideProps: {
                accessMethods: {
                  harmony: {
                    ...harmonyAccessMethod,
                    supportsConcatenation: true
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony'
              }
            })

            await user.click(screen.getByRole('checkbox', { name: concatCheckboxName }))

            expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
            expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({
              collectionId: 'collectionId',
              method: { harmony: { enableConcatenateDownload: true } }
            })
          })
        })
      })
    })
  })
})
