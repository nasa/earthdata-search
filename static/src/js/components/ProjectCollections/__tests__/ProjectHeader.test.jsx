import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ProjectHeader from '../ProjectHeader'
import Skeleton from '../../Skeleton/Skeleton'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectHeader,
  defaultZustandState: {
    project: {
      collections: {
        allIds: ['collectionId1'],
        byId: {
          collectionId1: {
            granules: {
              isLoading: false,
              isLoaded: true,
              count: 1,
              totalSize: {
                size: '4.0',
                unit: 'MB'
              },
              singleGranuleSize: 4
            }
          }
        }
      }
    },
    savedProject: {
      setProjectName: jest.fn()
    }
  }
})

describe('ProjectHeader component', () => {
  test('renders its title correctly', () => {
    setup({
      overrideZustandState: {
        savedProject: {
          project: {
            id: 1,
            name: 'test project'
          }
        }
      }
    })

    expect(screen.getByRole('heading', { name: 'test project' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'test project' })).toHaveTextContent('test project')
  })

  test('renders title correctly when a name value is not defined', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Untitled Project' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Untitled Project' })).toHaveTextContent('Untitled Project')
  })

  describe('when the collections are loading', () => {
    test('renders project metadata loading state', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: true,
                    isLoaded: false
                  }
                }
              }
            }
          }
        }
      })

      // Check for the skeleton container
      expect(Skeleton).toHaveBeenCalledTimes(1)
      expect(Skeleton).toHaveBeenCalledWith({
        containerStyle: {
          height: '21px',
          width: '100%'
        },
        shapes: [{
          'data-testid': 'skeleton-item',
          height: 12,
          left: 2,
          radius: 2,
          shape: 'rectangle',
          top: 6,
          width: 80
        }, {
          'data-testid': 'skeleton-item',
          height: 12,
          left: 90,
          radius: 2,
          shape: 'rectangle',
          top: 6,
          width: 50
        }, {
          'data-testid': 'skeleton-item',
          height: 12,
          left: 150,
          radius: 2,
          shape: 'rectangle',
          top: 6,
          width: 55
        }]
      }, {})
    })
  })

  describe('with one collection', () => {
    test('renders collection count correctly', () => {
      setup()

      expect(screen.getByText(/collection/i)).toHaveTextContent('1 Collection')
    })

    test('renders collection size correctly', () => {
      setup()

      expect(screen.getByText(/mb/i)).toHaveTextContent('4.0 MB')
    })
  })

  describe('with multiple collections', () => {
    test('renders collection count and size correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 5,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/collection/i)).toHaveTextContent('2 Collections')
      expect(screen.getByText(/mb/i)).toHaveTextContent('9.0 MB')
    })
  })

  describe('with one granule', () => {
    test('renders granule count correctly', () => {
      setup()

      expect(screen.getByText(/granule/i)).toHaveTextContent('1 Granule')
    })
  })

  describe('with multiple granules', () => {
    test('renders granule count correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 5,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('6 Granules')
    })
  })

  describe('with added granules', () => {
    test('renders granule count and size correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 3,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5,
                    addedGranuleIds: [1, 2, 3]
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded granules', () => {
    test('renders granule count and size correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 3,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 3,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5,
                    removedGranuleIds: [2]
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with duplicate excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 3,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5,
                    removedGranuleIds: [1, 2]
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with multiple granule, some of which being excluded', () => {
    test('renders granule count correctly', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 1,
                    totalSize: {
                      size: '4.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 4
                  }
                },
                collectionId2: {
                  granules: {
                    isLoading: false,
                    isLoaded: true,
                    count: 3,
                    totalSize: {
                      size: '5.0',
                      unit: 'MB'
                    },
                    singleGranuleSize: 5
                  }
                }
              }
            }
          }
        }
      })

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
    })
  })

  describe('editing project name', () => {
    test('when the state is editing the submit button is visible', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('textbox'))

      expect(screen.getByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()
    })

    test('when the state is not editing the edit button is visible', async () => {
      setup()

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.getByTestId('edit_button')).toBeInTheDocument()
    })

    test('focusing on project name and pressing enter enables editing', async () => {
      const { user } = setup()

      expect(screen.getByTestId('project-header__span')).toBeInTheDocument()

      screen.getByTestId('project-header__span').focus()
      await user.keyboard('{Enter}')

      expect(screen.getByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()
    })

    test('focusing on project name and pressing a non-enter key does not enable editing', async () => {
      const { user } = setup()

      expect(screen.getByTestId('project-header__span')).toBeInTheDocument()

      screen.getByTestId('project-header__span').focus()
      await user.keyboard('{a}')

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.getByTestId('edit_button')).toBeInTheDocument()
    })

    test('clicking on the project name enables editing', async () => {
      const { user } = setup({
        overrideZustandState: {
          savedProject: {
            project: {
              id: 1,
              name: 'test project'
            }
          }
        }
      })

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.getByTestId('edit_button')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /test project/i }))

      expect(screen.getByRole('button', { name: /test project/i })).toHaveClass('project-header__text-wrap')
      expect(screen.getByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()

      await user.keyboard('{Enter}')

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.getByTestId('edit_button')).toBeInTheDocument()
    })

    test('editing the text field changes the project name', async () => {
      const { user } = setup({
        overrideZustandState: {
          savedProject: {
            project: {
              id: 1,
              name: 'test project'
            }
          }
        }
      })

      const textbox = screen.getByRole('textbox')
      await user.click(textbox)

      expect(textbox.value).toBe('test project')

      await user.clear(textbox)
      await user.keyboard('{a}')

      expect(textbox.value).toBe('a')
    })

    test('clicking the edit button enables editing in the text field', async () => {
      const { user } = setup({
        overrideZustandState: {
          savedProject: {
            project: {
              id: 1,
              name: 'test project'
            }
          }
        }
      })

      await user.click(screen.getByTestId('edit_button'))
      const textbox = screen.getByRole('textbox')

      expect(textbox.value).toBe('test project')

      // User is editing the textbox value after clicking edit button
      await user.keyboard('{a}')

      expect(textbox.value).toBe('test projecta')
    })

    test('clicking the submit button calls setProjectName', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          savedProject: {
            project: {
              id: 1,
              name: 'test project'
            },
            setProjectName: jest.fn()
          }
        }
      })

      await user.click(screen.getByTestId('edit_button'))
      await user.click(screen.getByTestId('submit_button'))

      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledTimes(1)
      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledWith('test project')
    })

    test('pressing enter while editing calls setProjectName', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          savedProject: {
            project: {
              id: 1,
              name: 'test project'
            },
            setProjectName: jest.fn()
          }
        }
      })

      await user.click(screen.getByTestId('edit_button'))
      await user.keyboard('{Enter}')

      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledTimes(1)
      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledWith('test project')
    })
  })
})
