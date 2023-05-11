import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import ProjectHeader from '../ProjectHeader'
import '@testing-library/jest-dom'

const setup = (overrideProps) => {
  const props = {
    project: {
      collections: {
        allIds: ['collectionId1'],
        byId: {
          collectionId1: {
            granules: {
              isLoading: false,
              isLoaded: true,
              hits: 1,
              totalSize: { size: '4.0', unit: 'MB' },
              singleGranuleSize: 4
            }
          }
        }
      }
    },
    savedProject: {
      name: 'test project'
    },
    onUpdateProjectName: jest.fn(),
    ...overrideProps
  }
  act(() => {
    render(
      <ProjectHeader {...props} />
    )
  })
}

describe('ProjectHeader component', () => {
  test('renders its title correctly', () => {
    setup()

    expect(screen.getByRole('heading', { name: /test project/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /test project/i })).toHaveTextContent('test project')
  })

  test('renders title correctly when a name value is not defined', () => {
    const overrideProps = {
      savedProject: {
        name: undefined
      }
    }
    setup(overrideProps)

    expect(screen.getByRole('heading', { name: /untitled project/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /untitled project/i })).toHaveTextContent('Untitled Project')
  })

  describe('when the collections are loading', () => {
    test('renders project metadata loading state', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1'],
            byId: {
              collectionId1: {
                granules: {}
              }
            }
          }
        }
      }
      setup(overrideProps)
      const skeletons = screen.queryAllByTestId('project-header__skeleton')
      const skeleton = screen.getByTestId('project-header__skeleton')

      expect(skeletons.length).toEqual(1)
      expect(skeleton.querySelectorAll('div').length).toEqual(4) // top-level skeleton__inner div + 3 children divs
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
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 5,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

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
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 5,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('6 Granules')
    })
  })

  describe('with added granules', () => {
    test('renders granule count and size correctly', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 3,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5,
                  addedGranuleIds: [1, 2, 3]
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded granules', () => {
    test('renders granule count and size correctly', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 3,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 3,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5,
                  removedGranuleIds: [2]
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with duplicate excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 3,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5,
                  removedGranuleIds: [1, 2]
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
      expect(screen.getByText(/mb/i)).toHaveTextContent('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with multiple granule, some of which being excluded', () => {
    test('renders granule count correctly', () => {
      const overrideProps = {
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 1,
                  totalSize: { size: '4.0', unit: 'MB' },
                  singleGranuleSize: 4
                }
              },
              collectionId2: {
                granules: {
                  isLoading: false,
                  isLoaded: true,
                  hits: 3,
                  totalSize: { size: '5.0', unit: 'MB' },
                  singleGranuleSize: 5
                }
              }
            }
          }
        }
      }
      setup(overrideProps)

      expect(screen.getByText(/granules/i)).toHaveTextContent('4 Granules')
    })
  })

  describe('editing project name', () => {
    test('when the state is editing the submit button is visible', async () => {
      setup()
      const user = userEvent.setup()
      await user.click(screen.getByRole('textbox'))

      expect(screen.queryByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()
    })

    test('when the state is not editing the edit button is visible', async () => {
      setup()
      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).toBeInTheDocument()
    })

    test('focusing on project name and pressing enter enables editing', async () => {
      setup()
      const user = userEvent.setup()

      expect(screen.getByTestId('project-header__span')).toBeInTheDocument()

      screen.getByTestId('project-header__span').focus()
      await user.keyboard('{Enter}')

      expect(screen.queryByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()
    })

    test('focusing on project name and pressing a non-enter key does not enable editing', async () => {
      setup()
      const user = userEvent.setup()

      expect(screen.getByTestId('project-header__span')).toBeInTheDocument()

      screen.getByTestId('project-header__span').focus()
      await user.keyboard('{a}')

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).toBeInTheDocument()
    })

    test('clicking on the project name enables editing', async () => {
      setup()
      const user = userEvent.setup()

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /test project/i }))

      expect(screen.getByRole('button', { name: /test project/i })).toHaveClass('project-header__text-wrap')
      expect(screen.queryByTestId('submit_button')).toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).not.toBeInTheDocument()

      await user.keyboard('{Enter}')

      expect(screen.queryByTestId('submit_button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('edit_button')).toBeInTheDocument()
    })

    test('editing the text field changes the project name', async () => {
      setup()
      const user = userEvent.setup()
      const textbox = screen.getByRole('textbox')
      await user.click(textbox)

      expect(textbox.value).toBe('test project')

      await user.clear(textbox)
      await user.keyboard('{a}')

      expect(textbox.value).toBe('a')
    })

    test('clicking the edit button enables editing in the text field', async () => {
      setup()
      const user = userEvent.setup()
      await user.click(screen.getByTestId('edit_button'))
      const textbox = screen.getByRole('textbox')

      expect(textbox.value).toBe('test project')

      // user is editing the textbox value after clicking edit button
      await user.keyboard('{a}')

      expect(textbox.value).toBe('test projecta')
    })

    test('clicking the submit button calls onUpdateProjectName', async () => {
      const overrideProps = {
        onUpdateProjectName: jest.fn()
      }
      setup(overrideProps)
      const user = userEvent.setup()
      await user.click(screen.queryByTestId('edit_button'))
      await user.click(screen.queryByTestId('submit_button'))

      expect(overrideProps.onUpdateProjectName).toBeCalledTimes(1)
      expect(overrideProps.onUpdateProjectName).toBeCalledWith('test project')
    })

    test('pressing enter while editing calls onUpdateProjectName', async () => {
      const overrideProps = {
        onUpdateProjectName: jest.fn()
      }
      setup(overrideProps)
      const user = userEvent.setup()
      await user.click(screen.queryByTestId('edit_button'))
      await user.keyboard('{Enter}')

      expect(overrideProps.onUpdateProjectName).toBeCalledTimes(1)
      expect(overrideProps.onUpdateProjectName).toBeCalledWith('test project')
    })
  })
})
