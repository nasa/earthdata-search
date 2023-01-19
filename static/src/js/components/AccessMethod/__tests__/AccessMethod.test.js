import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AccessMethod } from '../AccessMethod'
import AccessMethodRadio from '../../FormFields/AccessMethodRadio/AccessMethodRadio'
import RadioList from '../../FormFields/RadioList/RadioList'
import ProjectPanelSection from '../../ProjectPanels/ProjectPanelSection'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    accessMethods: {},
    index: 0,
    isActive: true,
    metadata: {},
    shapefileId: null,
    spatial: {},
    temporal: {},
    overrideTemporal: {},
    onSelectAccessMethod: jest.fn(),
    onSetActivePanel: jest.fn(),
    onUpdateAccessMethod: jest.fn(),
    selectedAccessMethod: '',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AccessMethod {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AccessMethod component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  describe('handleAccessMethodSelection', () => {
    test('updates the selected access method', () => {
      const { enzymeWrapper, props } = setup()

      const collectionId = 'collectionId'
      enzymeWrapper.setProps({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        },
        metadata: {
          conceptId: collectionId,
          granule_count: 10000
        },
        granuleMetadata: {
          hits: 3800
        }
      })

      const radioList = enzymeWrapper.find(RadioList)
      radioList.props().onChange('download')

      expect(props.onSelectAccessMethod.mock.calls.length).toBe(1)
      expect(props.onSelectAccessMethod.mock.calls[0]).toEqual([{
        collectionId,
        selectedAccessMethod: 'download'
      }])
    })

    test('updates the selected access method when type is orderable', () => {
      const { enzymeWrapper, props } = setup()

      const collectionId = 'collectionId'
      enzymeWrapper.setProps({
        accessMethods: {
          esi0: {
            isValid: true,
            type: 'ESI'
          }
        },
        metadata: {
          conceptId: collectionId,
          granule_count: 10000
        },
        granuleMetadata: {
          hits: 3800
        }
      })

      const radioList = enzymeWrapper.find(RadioList)
      radioList.props().onChange('esi0')

      expect(props.onSelectAccessMethod.mock.calls.length).toBe(1)
      expect(props.onSelectAccessMethod.mock.calls[0]).toEqual([{
        collectionId,
        selectedAccessMethod: 'esi0'
      }])
    })
  })

  describe('radio button display', () => {
    test('renders a radio button for download', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        }
      })

      expect(enzymeWrapper.find(AccessMethodRadio).props().value).toEqual('download')
    })

    test('renders a radio button for echo orders', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS'
          }
        }
      })

      expect(enzymeWrapper.find(AccessMethodRadio).props().value).toEqual('echoOrder0')
    })

    test('renders a radio button for esi', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          esi: {
            isValid: true,
            type: 'ESI'
          }
        }
      })

      expect(enzymeWrapper.find(AccessMethodRadio).props().value).toEqual('esi')
    })

    test('renders a radio button for opendap', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          opendap: {
            isValid: true,
            type: 'OPeNDAP'
          }
        }
      })

      expect(enzymeWrapper.find(AccessMethodRadio).props().value).toEqual('opendap')
    })

    test('renders a radio button for harmony', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          harmony0: {
            isValid: true,
            type: 'Harmony'
          }
        }
      })

      expect(enzymeWrapper.find(AccessMethodRadio).props().value).toEqual('harmony0')
    })
  })

  describe('when the selected access method has an echoform', () => {
    test('lazy loads the echoforms component and provides the correct fallback', () => {
      const collectionId = 'collectionId'
      const form = 'echo form here'

      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS',
            form
          }
        },
        metadata: {
          conceptId: collectionId
        },
        selectedAccessMethod: 'echoOrder0'
      })

      enzymeWrapper.update()

      const customizationSection = enzymeWrapper.find(ProjectPanelSection).at(1)
      const echoFormWrapper = customizationSection.find(ProjectPanelSection).at(1)
      const suspenseComponent = echoFormWrapper.childAt(0)
      const echoForm = suspenseComponent.childAt(0)

      expect(echoFormWrapper.childAt(0).props().fallback.props.className).toEqual('access-method__echoform-loading')
      expect(echoForm.props().form).toEqual(form)
    })

    test('renders an echoform', () => {
      const collectionId = 'collectionId'
      const form = 'echo form here'

      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS',
            form
          }
        },
        metadata: {
          conceptId: collectionId
        },
        selectedAccessMethod: 'echoOrder0'
      })

      enzymeWrapper.update()

      const customizationSection = enzymeWrapper.find(ProjectPanelSection).at(1)
      const echoFormWrapper = customizationSection.find(ProjectPanelSection).at(1)
      const suspenseComponent = echoFormWrapper.childAt(0)
      const echoForm = suspenseComponent.childAt(0)

      expect(echoForm.props().collectionId).toEqual(collectionId)
      expect(echoForm.props().form).toEqual(form)
      expect(echoForm.props().methodKey).toEqual('echoOrder0')
      expect(echoForm.props().rawModel).toEqual(null)
      expect(typeof echoForm.props().onUpdateAccessMethod).toEqual('function')
    })

    test('renders an echoform with saved fields', () => {
      const collectionId = 'collectionId'
      const form = 'echo form here'
      const rawModel = 'saved fields'

      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS',
            form,
            rawModel
          }
        },
        metadata: {
          conceptId: collectionId
        },
        selectedAccessMethod: 'echoOrder0'
      })

      const customizationSection = enzymeWrapper.find(ProjectPanelSection).at(1)
      const echoFormWrapper = customizationSection.find(ProjectPanelSection).at(1)
      const suspenseComponent = echoFormWrapper.childAt(0)
      const echoForm = suspenseComponent.childAt(0)

      expect(echoForm.props().collectionId).toEqual(collectionId)
      expect(echoForm.props().form).toEqual(form)
      expect(echoForm.props().methodKey).toEqual('echoOrder0')
      expect(echoForm.props().rawModel).toEqual(rawModel)
      expect(typeof echoForm.props().onUpdateAccessMethod).toEqual('function')
    })
  })

  describe('when the selected access method is opendap', () => {
    test('selecting a output format calls onUpdateAccessMethod', () => {
      const { enzymeWrapper, props } = setup()

      const collectionId = 'collectionId'

      enzymeWrapper.setProps({
        accessMethods: {
          opendap: {
            isValid: true,
            type: 'OPeNDAP',
            supportedOutputFormats: ['NETCDF-3', 'NETCDF-4']
          }
        },
        metadata: {
          conceptId: collectionId
        },
        selectedAccessMethod: 'opendap'
      })

      const outputFormat = enzymeWrapper.find('#input__output-format')
      outputFormat.simulate('change', { target: { value: 'nc4' } })

      expect(props.onUpdateAccessMethod).toBeCalledTimes(1)
      expect(props.onUpdateAccessMethod).toBeCalledWith({
        collectionId: 'collectionId',
        method: {
          opendap: {
            selectedOutputFormat: 'nc4'
          }
        }
      })
    })
  })

  describe('when the selected access method is harmony', () => {
    describe('when supportedOutputFormats does not exist', () => {
      test('displays outputFormat field', () => {
        const { enzymeWrapper } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony'
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        expect(enzymeWrapper.find('#input__output-format').exists()).toBeFalsy()
      })
    })

    describe('when supportedOutputFormats exist', () => {
      test('displays outputFormat field', () => {
        const { enzymeWrapper } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony',
              supportedOutputFormats: ['NETCDF-3', 'NETCDF-4']
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        expect(enzymeWrapper.find('#input__output-format').exists()).toBeTruthy()
      })

      test('selecting a output format calls onUpdateAccessMethod', () => {
        const { enzymeWrapper, props } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony',
              supportedOutputFormats: ['NETCDF-3', 'NETCDF-4']
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        const outputFormat = enzymeWrapper.find('#input__output-format')
        outputFormat.simulate('change', { target: { value: 'nc4' } })

        expect(props.onUpdateAccessMethod).toBeCalledTimes(1)
        expect(props.onUpdateAccessMethod).toBeCalledWith({
          collectionId: 'collectionId',
          method: {
            harmony0: {
              selectedOutputFormat: 'nc4'
            }
          }
        })
      })
    })

    describe('when supportedOutputProjections does not exist', () => {
      test('displays outputFormat field', () => {
        const { enzymeWrapper } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony'
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        expect(enzymeWrapper.find('#input__output-projection').exists()).toBeFalsy()
      })
    })

    describe('when supportedOutputProjections exist', () => {
      test('displays outputProjection field', () => {
        const { enzymeWrapper } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony',
              supportedOutputProjections: ['EPSG:4326']
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        expect(enzymeWrapper.find('#input__output-projection').exists()).toBeTruthy()
      })

      test('selecting a output projection calls onUpdateAccessMethod', () => {
        const { enzymeWrapper, props } = setup()

        const collectionId = 'collectionId'

        enzymeWrapper.setProps({
          accessMethods: {
            harmony0: {
              isValid: true,
              type: 'Harmony',
              supportedOutputProjections: ['EPSG:4326']
            }
          },
          metadata: {
            conceptId: collectionId
          },
          selectedAccessMethod: 'harmony0'
        })

        const outputFormat = enzymeWrapper.find('#input__output-projection')
        outputFormat.simulate('change', { target: { value: 'EPSG:4326' } })

        expect(props.onUpdateAccessMethod).toBeCalledTimes(1)
        expect(props.onUpdateAccessMethod).toBeCalledWith({
          collectionId: 'collectionId',
          method: {
            harmony0: {
              selectedOutputProjection: 'EPSG:4326'
            }
          }
        })
      })
    })

    describe('when temporal subsetting is not supported', () => {
      describe('when a temporal range is not set', () => {
        test('does not display the temporal subsetting input', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: false
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0'
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').exists()).not.toBeTruthy()
        })
      })

      describe('when a temporal range is set', () => {
        test('does not display the temporal subsetting input', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: false
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').exists()).not.toBeTruthy()
        })
      })
    })

    describe('when temporal subsetting is supported', () => {
      describe('when a temporal range is not set', () => {
        test('displays a message about temporal subsetting', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0'
          })

          expect(enzymeWrapper.find('.access-method__section-status').text()).toContain('No temporal range selected.')
        })
      })

      describe('when a temporal range is set', () => {
        test('displays a checkbox input', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').length).toEqual(1)
        })

        test('displays the correct selected temporal range', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('.access-method__section-status').text()).toContain('Selected Range:2008-06-27 00:00:00 to 2021-08-01 23:59:59')
        })

        describe('when only an start date is set', () => {
          test('displays the correct selected temporal range', () => {
            const { enzymeWrapper } = setup()

            const collectionId = 'collectionId'

            enzymeWrapper.setProps({
              accessMethods: {
                harmony0: {
                  isValid: true,
                  type: 'Harmony',
                  supportsTemporalSubsetting: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony0',
              temporal: {
                startDate: '2008-06-27T00:00:00.979Z',
                isRecurring: false
              }
            })

            expect(enzymeWrapper.find('.access-method__section-status').text()).toContain('Selected Range:2008-06-27 00:00:00 ongoing')
          })

          describe('when only an end date is set', () => {
            test('displays the correct selected temporal range', () => {
              const { enzymeWrapper } = setup()

              const collectionId = 'collectionId'

              enzymeWrapper.setProps({
                accessMethods: {
                  harmony0: {
                    isValid: true,
                    type: 'Harmony',
                    supportsTemporalSubsetting: true
                  }
                },
                metadata: {
                  conceptId: collectionId
                },
                selectedAccessMethod: 'harmony0',
                temporal: {
                  endDate: '2008-06-27T00:00:00.979Z',
                  isRecurring: false
                }
              })

              expect(enzymeWrapper.find('.access-method__section-status').text()).toContain('Selected Range:Up to 2008-06-27 00:00:00')
            })
          })
        })
      })

      describe('when the temporal selection is recurring', () => {
        test('sets the checkbox unchecked', () => {
          const { enzymeWrapper } = setup({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: 'collectionId'
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              recurringDayStart: 0,
              recurringDayEnd: 10,
              isRecurring: true
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(false)
        })

        test('sets the checkbox disabled', () => {
          const { enzymeWrapper } = setup({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: 'collectionId'
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              recurringDayStart: 0,
              recurringDayEnd: 10,
              isRecurring: true
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').props().disabled).toEqual(true)
        })

        test('sets a warning in the section', () => {
          const { enzymeWrapper } = setup({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: 'collectionId'
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              recurringDayStart: 0,
              recurringDayEnd: 10,
              isRecurring: true
            }
          })

          expect(enzymeWrapper.find(ProjectPanelSection).at(1).childAt(0).props().warning).toEqual('To prevent unexpected results, temporal subsetting is not supported for recurring dates.')
        })
      })

      describe('when enableTemporalSubsetting is not set', () => {
        test('defaults the checkbox checked', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(true)
        })
      })

      describe('when enableTemporalSubsetting is set to true', () => {
        test('sets the checkbox checked', () => {
          const { enzymeWrapper } = setup()

          const collectionId = 'collectionId'

          enzymeWrapper.setProps({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true,
                enableTemporalSubsetting: true
              }
            },
            metadata: {
              conceptId: collectionId
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(true)
        })

        describe('when the user clicks the checkbox', () => {
          test('sets the checkbox checked', () => {
            const { enzymeWrapper } = setup()

            const collectionId = 'collectionId'

            enzymeWrapper.setProps({
              accessMethods: {
                harmony0: {
                  isValid: true,
                  type: 'Harmony',
                  supportsTemporalSubsetting: true,
                  enableTemporalSubsetting: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony0',
              temporal: {
                startDate: '2008-06-27T00:00:00.979Z',
                endDate: '2021-08-01T23:59:59.048Z',
                isRecurring: false
              }
            })

            const checkbox = enzymeWrapper.find('#input__temporal-subsetting')

            checkbox.simulate('change', { target: { checked: false } })

            enzymeWrapper.update()

            expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(false)
          })

          test('calls onUpdateAccessMethod', () => {
            const { enzymeWrapper, props } = setup({
              accessMethods: {
                harmony0: {
                  isValid: true,
                  type: 'Harmony',
                  supportsTemporalSubsetting: true,
                  enableTemporalSubsetting: true
                }
              },
              metadata: {
                conceptId: 'collectionId'
              },
              selectedAccessMethod: 'harmony0',
              temporal: {
                startDate: '2008-06-27T00:00:00.979Z',
                endDate: '2021-08-01T23:59:59.048Z',
                isRecurring: false
              }
            })

            const checkbox = enzymeWrapper.find('#input__temporal-subsetting')

            checkbox.simulate('change', { target: { checked: false } })

            enzymeWrapper.update()

            expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
            expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({ collectionId: 'collectionId', method: { harmony0: { enableTemporalSubsetting: false } } })
          })
        })
      })

      describe('when enableTemporalSubsetting is set to false', () => {
        test('sets the checkbox unchecked', () => {
          const { enzymeWrapper } = setup({
            accessMethods: {
              harmony0: {
                isValid: true,
                type: 'Harmony',
                supportsTemporalSubsetting: true,
                enableTemporalSubsetting: false
              }
            },
            metadata: {
              conceptId: 'collectionId'
            },
            selectedAccessMethod: 'harmony0',
            temporal: {
              startDate: '2008-06-27T00:00:00.979Z',
              endDate: '2021-08-01T23:59:59.048Z',
              isRecurring: false
            }
          })

          expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(false)
        })

        describe('when the user clicks the checkbox', () => {
          test('sets the checkbox unchecked', () => {
            const { enzymeWrapper } = setup()

            const collectionId = 'collectionId'

            enzymeWrapper.setProps({
              accessMethods: {
                harmony0: {
                  isValid: true,
                  type: 'Harmony',
                  supportsTemporalSubsetting: true,
                  enableTemporalSubsetting: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony0',
              temporal: {
                startDate: '2008-06-27T00:00:00.979Z',
                endDate: '2021-08-01T23:59:59.048Z',
                isRecurring: false
              }
            })

            const checkbox = enzymeWrapper.find('#input__temporal-subsetting')

            checkbox.simulate('change', { target: { checked: true } })

            enzymeWrapper.update()

            expect(enzymeWrapper.find('#input__temporal-subsetting').props().checked).toEqual(true)
          })

          test('calls onUpdateAccessMethod', () => {
            const { enzymeWrapper, props } = setup()

            const collectionId = 'collectionId'

            enzymeWrapper.setProps({
              accessMethods: {
                harmony0: {
                  isValid: true,
                  type: 'Harmony',
                  supportsTemporalSubsetting: true,
                  enableTemporalSubsetting: true
                }
              },
              metadata: {
                conceptId: collectionId
              },
              selectedAccessMethod: 'harmony0',
              temporal: {
                startDate: '2008-06-27T00:00:00.979Z',
                endDate: '2021-08-01T23:59:59.048Z',
                isRecurring: false
              }
            })

            const checkbox = enzymeWrapper.find('#input__temporal-subsetting')

            checkbox.simulate('change', { target: { checked: true } })

            enzymeWrapper.update()

            expect(props.onUpdateAccessMethod).toHaveBeenCalledTimes(1)
            expect(props.onUpdateAccessMethod).toHaveBeenCalledWith({ collectionId: 'collectionId', method: { harmony0: { enableTemporalSubsetting: true } } })
          })
        })
      })
    })
  })
})
