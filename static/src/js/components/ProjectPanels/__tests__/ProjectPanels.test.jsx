import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../jestConfigs/getByTextWithMarkup'

import AccessMethod from '../../AccessMethod/AccessMethod'
import CollectionDetails from '../CollectionDetails'
import DataQualitySummary from '../../DataQualitySummary/DataQualitySummary'
import ProjectPanels from '../ProjectPanels'
import Skeleton from '../../Skeleton/Skeleton'
import VariableDetailsPanel from '../VariableDetailsPanel'
import VariableTreePanel from '../VariableTreePanel'

import { MODAL_NAMES } from '../../../constants/modalNames'

// Mock components, but use the actual component
jest.mock('../../Panels/PanelGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../Panels/PanelGroup')
}))

jest.mock('../../AccessMethod/AccessMethod', () => {
  const ActualAccessMethod = jest.requireActual('../../AccessMethod/AccessMethod').default

  return {
    __esModule: true,
    default: jest.fn((props) => <ActualAccessMethod {...props} />)
  }
})

jest.mock('../CollectionDetails', () => {
  const ActualCollectionDetails = jest.requireActual('../CollectionDetails').default

  return {
    __esModule: true,
    default: jest.fn((props) => <ActualCollectionDetails {...props} />)
  }
})

jest.mock('../../DataQualitySummary/DataQualitySummary', () => {
  const ActualDataQualitySummary = jest.requireActual('../../DataQualitySummary/DataQualitySummary').default

  return {
    __esModule: true,
    default: jest.fn((props) => <ActualDataQualitySummary {...props} />)
  }
})

jest.mock('../VariableDetailsPanel', () => {
  const ActualVariableDetailsPanel = jest.requireActual('../VariableDetailsPanel').default

  return {
    __esModule: true,
    default: jest.fn((props) => <ActualVariableDetailsPanel {...props} />)
  }
})

jest.mock('../VariableTreePanel', () => {
  const ActualVariableTreePanel = jest.requireActual('../VariableTreePanel').default

  return {
    __esModule: true,
    default: jest.fn((props) => <ActualVariableTreePanel {...props} />)
  }
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/project',
    search: '?p=collectionId!collectionId&pg[1][v]=t',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const breadcrumbSkeleton = {
  className: 'panel-group-header__breadcrumbs-skeleton',
  containerStyle: {
    height: '1.5rem',
    width: '100%'
  },
  shapes: [
    {
      height: 18,
      left: 0,
      radius: 2,
      shape: 'rectangle',
      top: 3,
      width: 280
    }
  ]
}

const headingSkeleton = {
  className: 'panel-group-header__heading panel-group-header__heading--skeleton',
  containerStyle: {
    display: 'inline-block',
    height: '1.25rem',
    width: '100%'
  },
  shapes: [
    {
      height: 22,
      left: 0,
      radius: 2,
      shape: 'rectangle',
      top: 0,
      width: 280
    }
  ]
}

const radioSkeleton = {
  containerStyle: {
    height: '4.95rem',
    width: '20rem'
  },
  shapes: [
    {
      height: 15,
      left: '3rem',
      radius: 2,
      shape: 'rectangle',
      top: '1.1rem',
      width: 150
    },
    {
      height: 12,
      left: '3rem',
      radius: 2,
      shape: 'rectangle',
      top: '3rem',
      width: 250
    },
    {
      left: '1rem',
      shape: 'circle',
      top: '2rem'
    }
  ]
}

const setup = setupTest({
  Component: ProjectPanels,
  defaultProps: {
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    dataQualitySummaries: {
      byCollectionId: {},
      setDataQualitySummaries: jest.fn()
    },
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: {
          title: 'Test Collection Title',
          isCSDA: false,
          cloudHosted: false,
          duplicateCollections: []
        }
      },
      setCollectionId: jest.fn()
    },
    project: {
      addGranuleToProjectCollection: jest.fn(),
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              allIds: ['granuleId'],
              byId: {
                granuleId: {
                  title: 'Test Granule Title'
                }
              },
              count: 1
            },
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        isLoading: false
      },
      updateAccessMethod: jest.fn()
    },
    query: {
      collections: {
        byId: {
          collectionId: {
            granules: {}
          }
        }
      },
      dataQualitySummaries: {
        byCollectionId: {},
        setDataQualitySummaries: jest.fn()
      }
    },
    projectPanels: {
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      setIsOpen: jest.fn()
    },
    ui: {
      modals: {
        setOpenModal: jest.fn()
      }
    }
  },
  withRedux: true,
  withRouter: true
})

describe('ProjectPanels component', () => {
  describe('when there are no project collections', () => {
    test('should not render the panels', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: []
            }
          }
        }
      })

      expect(AccessMethod).toHaveBeenCalledTimes(0)
      expect(CollectionDetails).toHaveBeenCalledTimes(0)
      expect(DataQualitySummary).toHaveBeenCalledTimes(0)
      expect(VariableDetailsPanel).toHaveBeenCalledTimes(0)
      expect(VariableTreePanel).toHaveBeenCalledTimes(0)
    })
  })

  describe('when project collections are loading', () => {
    test('should render skeletons', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              isLoading: true
            }
          }
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(10)

      expect(Skeleton).toHaveBeenNthCalledWith(1, expect.objectContaining(breadcrumbSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(2, expect.objectContaining(headingSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(3, expect.objectContaining(radioSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(4, expect.objectContaining(radioSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(5, expect.objectContaining(breadcrumbSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(6, expect.objectContaining(headingSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(7, expect.objectContaining(radioSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(8, expect.objectContaining(radioSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(9, expect.objectContaining(radioSkeleton), {})
      expect(Skeleton).toHaveBeenNthCalledWith(10, expect.objectContaining(radioSkeleton), {})
    })
  })

  describe('when there are project collections', () => {
    describe('when viewing the collection details panel', () => {
      test('renders the CollectionDetails component', () => {
        setup({
          overrideZustandState: {
            projectPanels: {
              panels: {
                activePanel: '1.0.0'
              }
            }
          }
        })

        expect(CollectionDetails).toHaveBeenCalledTimes(2)
        const collectionDetailsProps = {
          collectionId: 'collectionId',
          isActive: true,
          panelScrollableNodeRef: { current: null },
          projectCollection: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            granules: {
              allIds: ['granuleId'],
              byId: { granuleId: { title: 'Test Granule Title' } },
              count: 1
            },
            selectedAccessMethod: 'download'
          }
        }
        expect(CollectionDetails).toHaveBeenCalledWith(collectionDetailsProps, {})
      })

      describe('when clicking Edit Project Options', () => {
        test('switches to the edit options panel', async () => {
          const { user } = setup({
            overrideZustandState: {
              projectPanels: {
                panels: {
                  activePanel: '1.0.0'
                }
              }
            }
          })

          jest.clearAllMocks()

          const moreActions = screen.getByRole('button', { name: 'More actions' })
          await user.click(moreActions)

          const editButton = screen.getByRole('button', { name: 'Edit Project Options' })
          await user.click(editButton)

          // CollectionDetails should not be called when viewing the edit options panel
          expect(CollectionDetails).toHaveBeenCalledTimes(0)

          expect(screen.getByText('Edit Options')).toBeInTheDocument()
        })
      })

      describe('when collection is CSDA', () => {
        test('should display CSDA message', () => {
          setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    title: 'Test Collection Title',
                    isCSDA: true,
                    cloudHosted: false,
                    duplicateCollections: []
                  }
                }
              },
              projectPanels: {
                panels: {
                  activePanel: '1.0.0'
                }
              }
            }
          })

          expect(screen.getByText('NASA Commercial Smallsat Data Acquisition (CSDA) Program')).toBeInTheDocument()
        })

        describe('when clicking the More Details button', () => {
          test('calls setOpenModal', async () => {
            const { user, zustandState } = setup({
              overrideZustandState: {
                collection: {
                  collectionMetadata: {
                    collectionId: {
                      title: 'Test Collection Title',
                      isCSDA: true,
                      cloudHosted: false,
                      duplicateCollections: []
                    }
                  }
                },
                projectPanels: {
                  panels: {
                    activePanel: '1.0.0'
                  }
                }
              }
            })

            const button = screen.getByRole('button', { name: 'More details' })
            await user.click(button)

            expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
            expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ABOUT_CSDA)
          })
        })
      })
    })

    describe('when viewing the edit options panel', () => {
      test('should display collection title', () => {
        setup()

        expect(screen.getByRole('button', { name: 'Test Collection Title' })).toBeInTheDocument()
      })

      test('should display collection count in footer', () => {
        setup()

        expect(screen.getByText('Collection 1 of 1')).toBeInTheDocument()
      })

      describe('when clicking the collection title', () => {
        test('shows the collection details panel', async () => {
          const { user } = setup()

          const title = screen.getByRole('button', { name: 'Test Collection Title' })
          await user.click(title)

          // Collection Title
          expect(screen.getByText('Test Collection Title')).toBeInTheDocument()

          // Granule Count
          expect(screen.getByText('Showing 1 of 1 granule in project')).toBeInTheDocument()

          // Granules
          expect(screen.getByRole('button', { name: 'Test Granule Title' })).toBeInTheDocument()
        })
      })

      describe('when clicking the View Project Granules button', () => {
        test('shows the collection details panel', async () => {
          const { user } = setup()

          jest.clearAllMocks()

          const moreActions = screen.getByRole('button', { name: 'More actions' })
          await user.click(moreActions)

          const viewGranulesButton = screen.getByRole('button', { name: 'View Project Granules' })
          await user.click(viewGranulesButton)

          expect(CollectionDetails).toHaveBeenCalledTimes(1)
          expect(CollectionDetails).toHaveBeenCalledWith({
            collectionId: 'collectionId',
            isActive: true,
            panelScrollableNodeRef: { current: null },
            projectCollection: {
              accessMethods: {
                download: {
                  isValid: true,
                  type: 'download'
                }
              },
              granules: {
                allIds: ['granuleId'],
                byId: { granuleId: { title: 'Test Granule Title' } },
                count: 1
              },
              selectedAccessMethod: 'download'
            }
          }, {})
        })
      })

      describe('when collection is CSDA', () => {
        test('should display CSDA message', () => {
          setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    title: 'Test Collection Title',
                    isCSDA: true,
                    cloudHosted: false,
                    duplicateCollections: []
                  }
                }
              }
            }
          })

          expect(screen.getByText('NASA Commercial Smallsat Data Acquisition (CSDA) Program')).toBeInTheDocument()
        })

        describe('when clicking the More Details button', () => {
          test('calls setOpenModal', async () => {
            const { user, zustandState } = setup({
              overrideZustandState: {
                collection: {
                  collectionMetadata: {
                    collectionId: {
                      title: 'Test Collection Title',
                      isCSDA: true,
                      cloudHosted: false,
                      duplicateCollections: []
                    }
                  }
                }
              }
            })

            const button = screen.getByRole('button', { name: 'More details' })
            await user.click(button)

            expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
            expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ABOUT_CSDA)
          })
        })
      })

      describe('when the collection has a data quality summary', () => {
        test('shows the data quality summary', () => {
          setup({
            overrideZustandState: {

            }
          })
        })
      })

      describe('with multiple collections', () => {
        const twoCollectionState = {
          collection: {
            collectionId: 'collectionId1',
            collectionMetadata: {
              collectionId1: {
                title: 'Test Collection Title 1',
                isCSDA: false,
                cloudHosted: false,
                duplicateCollections: []
              },
              collectionId2: {
                title: 'Test Collection Title 2',
                isCSDA: false,
                cloudHosted: false,
                duplicateCollections: []
              }
            }
          },
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    allIds: ['granuleId1'],
                    count: 1
                  },
                  accessMethods: {
                    download: {
                      isValid: true,
                      type: 'download'
                    }
                  },
                  selectedAccessMethod: 'download'
                },
                collectionId2: {
                  granules: {
                    allIds: ['granuleId2'],
                    count: 1
                  },
                  accessMethods: {
                    download: {
                      isValid: true,
                      type: 'download'
                    }
                  },
                  selectedAccessMethod: 'download'
                }
              }
            }
          }
        }

        describe('when clicking the Next button', () => {
          test('calls setActivePanel', async () => {
            const { user } = setup({
              overrideZustandState: twoCollectionState
            })

            expect(screen.getByText('Test Collection Title 1')).toBeInTheDocument()

            const button = screen.getByRole('button', { name: 'Next Collection' })
            await user.click(button)

            expect(screen.getByText('Test Collection Title 2')).toBeInTheDocument()
          })
        })

        describe('when clicking the Back button', () => {
          test('calls setActivePanel', async () => {
            const { user } = setup({
              overrideZustandState: twoCollectionState
            })

            const nextButton = screen.getByRole('button', { name: 'Next Collection' })
            await user.click(nextButton)

            expect(screen.getByText('Test Collection Title 2')).toBeInTheDocument()

            const previousButton = screen.getByRole('button', { name: 'Previous Collection' })
            await user.click(previousButton)

            expect(screen.getByText('Test Collection Title 1')).toBeInTheDocument()
          })
        })
      })

      describe('when clicking the Done button', () => {
        test('calls setCollectionId and setIsOpen', async () => {
          const { user, zustandState } = setup()

          jest.clearAllMocks()

          const button = screen.getByRole('button', { name: 'Done' })
          await user.click(button)

          expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
          expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)

          expect(zustandState.projectPanels.setIsOpen).toHaveBeenCalledTimes(1)
          expect(zustandState.projectPanels.setIsOpen).toHaveBeenCalledWith(false)
        })
      })

      describe('when viewing the ESI access method', () => {
        describe('when clicking the Reset Form button', () => {
          test('calls updateAccessMethod', async () => {
            const { user, zustandState } = setup({
              overrideZustandState: {
                project: {
                  collections: {
                    allIds: ['collectionId'],
                    byId: {
                      collectionId: {
                        granules: {
                          allIds: ['granuleId'],
                          count: 1
                        },
                        accessMethods: {
                          esi: {
                            isValid: true,
                            type: 'ESI'
                          }
                        },
                        selectedAccessMethod: 'esi'
                      }
                    }
                  }
                }
              }
            })

            const button = screen.getByRole('button', { name: 'Reset Form' })
            await user.click(button)

            expect(zustandState.project.updateAccessMethod).toHaveBeenCalledTimes(1)
            expect(zustandState.project.updateAccessMethod).toHaveBeenCalledWith({
              collectionId: 'collectionId',
              method: {
                esi: {
                  model: undefined,
                  rawModel: undefined
                }
              }
            })
          })
        })
      })

      describe('when viewing the ECHO ORDERS access method', () => {
        describe('when clicking the Reset Form button', () => {
          test('calls updateAccessMethod', async () => {
            const { user, zustandState } = setup({
              overrideZustandState: {
                project: {
                  collections: {
                    allIds: ['collectionId'],
                    byId: {
                      collectionId: {
                        granules: {
                          allIds: ['granuleId'],
                          count: 1
                        },
                        accessMethods: {
                          echoOrders: {
                            isValid: true,
                            type: 'ECHO ORDERS'
                          }
                        },
                        selectedAccessMethod: 'echoOrders'
                      }
                    }
                  }
                }
              }
            })

            const button = screen.getByRole('button', { name: 'Reset Form' })
            await user.click(button)

            expect(zustandState.project.updateAccessMethod).toHaveBeenCalledTimes(1)
            expect(zustandState.project.updateAccessMethod).toHaveBeenCalledWith({
              collectionId: 'collectionId',
              method: {
                echoOrders: {
                  model: undefined,
                  rawModel: undefined
                }
              }
            })
          })
        })
      })

      describe('when viewing the Harmony access method', () => {
        const harmonyState = {
          project: {
            collections: {
              allIds: ['collectionId'],
              byId: {
                collectionId: {
                  granules: {
                    allIds: ['granuleId'],
                    count: 1
                  },
                  accessMethods: {
                    harmony: {
                      description: 'Harmony access method',
                      name: 'Harmony',
                      hierarchyMappings: [{
                        id: 'variableId'
                      }],
                      isValid: true,
                      type: 'Harmony',
                      supportsVariableSubsetting: true,
                      variables: {
                        variableId: {
                          conceptId: 'variableId',
                          definition: 'latitude',
                          instanceInformation: null,
                          longName: 'Latitudes of pixel locations',
                          name: 'latitude',
                          nativeId: 'latitude',
                          scienceKeywords: null
                        }
                      }
                    }
                  },
                  selectedAccessMethod: 'harmony'
                }
              }
            }
          }
        }

        describe('when viewing variables', () => {
          test('should render variable panels', async () => {
            const { user } = setup({
              overrideZustandState: harmonyState
            })

            const button = screen.getByRole('button', { name: 'Edit Variables' })
            await user.click(button)

            expect(screen.getByText('Variable Selection')).toBeInTheDocument()

            expect(screen.getByRole('checkbox', { name: 'latitude Latitudes of pixel locations' })).toBeInTheDocument()
          })

          describe('when selecting a variable', () => {
            test('should update the access method', async () => {
              const { user, zustandState } = setup({
                overrideZustandState: harmonyState
              })

              const button = screen.getByRole('button', { name: 'Edit Variables' })
              await user.click(button)

              const checkbox = screen.getByRole('checkbox', { name: 'latitude Latitudes of pixel locations' })
              await user.click(checkbox)

              expect(zustandState.project.updateAccessMethod).toHaveBeenCalledTimes(1)
              expect(zustandState.project.updateAccessMethod).toHaveBeenCalledWith({
                collectionId: 'collectionId',
                method: {
                  harmony: {
                    description: 'Harmony access method',
                    hierarchyMappings: [{ id: 'variableId' }],
                    isValid: true,
                    name: 'Harmony',
                    selectedVariables: ['variableId'],
                    supportsVariableSubsetting: true,
                    type: 'Harmony',
                    variables: {
                      variableId: {
                        conceptId: 'variableId',
                        definition: 'latitude',
                        instanceInformation: null,
                        longName: 'Latitudes of pixel locations',
                        name: 'latitude',
                        nativeId: 'latitude',
                        scienceKeywords: null
                      }
                    }
                  }
                }
              })
            })
          })

          describe('when clicking View Details', () => {
            test('views the variable details', async () => {
              const { user } = setup({
                overrideZustandState: harmonyState
              })

              const button = screen.getByRole('button', { name: 'Edit Variables' })
              await user.click(button)

              const viewDetailsButton = screen.getByRole('button', { name: 'View details' })
              await user.click(viewDetailsButton)

              expect(screen.getByRole('heading', {
                name: 'latitude',
                level: 2
              })).toBeInTheDocument()
            })

            describe('when clicking the Back button', () => {
              test('returns to the variable selection panel', async () => {
                const { user } = setup({
                  overrideZustandState: harmonyState
                })

                const button = screen.getByRole('button', { name: 'Edit Variables' })
                await user.click(button)

                const viewDetailsButton = screen.getByRole('button', { name: 'View details' })
                await user.click(viewDetailsButton)

                const backButton = screen.getByRole('button', { name: 'Back' })
                await user.click(backButton)

                expect(screen.getByText('Variable Selection')).toBeInTheDocument()
              })
            })
          })
        })
      })

      describe('when viewing a collection with a duplicate collection', () => {
        describe('when the collection is datacenter hosted', () => {
          test('should display duplicate collection message', async () => {
            const { user } = setup({
              overrideZustandState: {
                collection: {
                  collectionMetadata: {
                    collectionId: {
                      title: 'Test Collection Title',
                      isCSDA: false,
                      cloudHosted: false,
                      duplicateCollections: ['duplicateCollectionId']
                    }
                  }
                }
              }
            })

            const openButton = screen.getByRole('button', { name: 'Open Panel' })
            await user.click(openButton)

            const element = getByTextWithMarkup('This dataset is hosted inside a NASA datacenter. The dataset is also hosted in the Earthdata Cloud, and may have different services available.')
            expect(element).toBeInTheDocument()
          })

          describe('when clicking the duplicate collection link', () => {
            test('should navigate to the duplicate collection', async () => {
              const { props, user } = setup({
                overrideZustandState: {
                  collection: {
                    collectionMetadata: {
                      collectionId: {
                        title: 'Test Collection Title',
                        isCSDA: false,
                        cloudHosted: false,
                        duplicateCollections: ['duplicateCollectionId']
                      }
                    }
                  }
                }
              })

              const openButton = screen.getByRole('button', { name: 'Open Panel' })
              await user.click(openButton)

              const link = screen.getByRole('link', { name: 'hosted in the Earthdata Cloud' })
              await user.click(link)

              expect(props.onChangePath).toHaveBeenCalledTimes(1)
              expect(props.onChangePath).toHaveBeenCalledWith('/search/granules?p=duplicateCollectionId!collectionId&pg[1][v]=t')
            })
          })
        })

        describe('when the collection is cloud hosted', () => {
          test('should display duplicate collection message for datacenter hosted', async () => {
            const { user } = setup({
              overrideZustandState: {
                collection: {
                  collectionMetadata: {
                    collectionId: {
                      title: 'Test Collection Title',
                      isCSDA: false,
                      cloudHosted: true,
                      duplicateCollections: ['duplicateCollectionId']
                    }
                  }
                }
              }
            })

            const openButton = screen.getByRole('button', { name: 'Open Panel' })
            await user.click(openButton)

            const element = getByTextWithMarkup('This dataset is hosted in the Earthdata Cloud. The dataset is also hosted in a NASA datacenter, and may have different services available.')
            expect(element).toBeInTheDocument()
          })

          describe('when clicking the duplicate collection link', () => {
            test('should navigate to the duplicate collection', async () => {
              const { props, user } = setup({
                overrideZustandState: {
                  collection: {
                    collectionMetadata: {
                      collectionId: {
                        title: 'Test Collection Title',
                        isCSDA: false,
                        cloudHosted: true,
                        duplicateCollections: ['duplicateCollectionId']
                      }
                    }
                  }
                }
              })

              const openButton = screen.getByRole('button', { name: 'Open Panel' })
              await user.click(openButton)

              const link = screen.getByRole('link', { name: 'hosted in a NASA datacenter' })
              await user.click(link)

              expect(props.onChangePath).toHaveBeenCalledTimes(1)
              expect(props.onChangePath).toHaveBeenCalledWith('/search/granules?p=duplicateCollectionId!collectionId&pg[1][v]=t')
            })
          })
        })
      })

      describe('when the collection has data quality summaries', () => {
        test('renders the data quality summaries', async () => {
          const { user } = setup({
            overrideZustandState: {
              dataQualitySummaries: {
                byCollectionId: {
                  collectionId: [{
                    id: '1234',
                    summary: 'Test Summary'
                  }]
                }
              }
            }
          })

          const openButton = screen.getByRole('button', { name: 'Open Panel' })
          await user.click(openButton)

          expect(screen.getByText('Test Summary')).toBeInTheDocument()
        })
      })
    })
  })
})
