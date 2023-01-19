import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import Skeleton from '../../Skeleton/Skeleton'
import ProjectHeader from '../ProjectHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    collectionsQuery: {
      pageNum: 1
    },
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

  const enzymeWrapper = mount(<ProjectHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectHeader component', () => {
  test('renders its title correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('header').length).toBe(1)
    expect(enzymeWrapper.find('.project-header__title').find('input').props().value).toEqual('test project')
  })

  describe('when the collections are loading', () => {
    test('renders project metadata loading state', () => {
      const { enzymeWrapper } = setup({
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
      })
      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
      expect(enzymeWrapper.find(Skeleton).prop('shapes').length).toEqual(3)
    })
  })

  describe('with one collection', () => {
    test('renders collection count correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.project-header__stats-item--collections').text()).toEqual('1 Collection')
    })

    test('renders collection size correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.project-header__stats-item--size').text().indexOf('4.0 MB') > -1).toEqual(true)
    })
  })

  describe('with multiple collections', () => {
    test('renders collection count and size correctly', () => {
      const { enzymeWrapper } = setup({
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--collections').text()).toEqual('2 Collections')
      expect(enzymeWrapper.find('.project-header__stats-item--size').text().indexOf('9.0 MB') > -1).toEqual(true)
    })
  })

  describe('with one granule', () => {
    test('renders granule count correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('1 Granule')
    })
  })

  describe('with multiple granules', () => {
    test('renders granule count correctly', () => {
      const { enzymeWrapper } = setup({
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('6 Granules')
    })
  })

  describe('with added granules', () => {
    test('renders granule count and size correctly', () => {
      const { enzymeWrapper } = setup({
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
      expect(enzymeWrapper.find('.project-header__stats-item--size').text()).toEqual('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded granules', () => {
    test('renders granule count and size correctly', () => {
      const { enzymeWrapper } = setup({
        collectionsQuery: {
          byId: {
            collectionId2: {
              excludedGranuleIds: [1, 2]
            }
          }
        },
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
      expect(enzymeWrapper.find('.project-header__stats-item--size').text()).toEqual('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      const { enzymeWrapper } = setup({
        collectionsQuery: {
          byId: {
            collectionId2: {
              excludedGranuleIds: [1]
            }
          }
        },
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
      expect(enzymeWrapper.find('.project-header__stats-item--size').text()).toEqual('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with duplicate excluded and removed granules', () => {
    test('renders granule count and size correctly', () => {
      const { enzymeWrapper } = setup({
        collectionsQuery: {
          byId: {
            collectionId2: {
              excludedGranuleIds: [1]
            }
          }
        },
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
      expect(enzymeWrapper.find('.project-header__stats-item--size').text()).toEqual('19.0 MB') // 3 * 5MB + 1 * 4MB
    })
  })

  describe('with multiple granule, some of which being excluded', () => {
    test('renders granule count correctly', () => {
      const { enzymeWrapper } = setup({
        collectionsQuery: {
          byId: {
            collectionId2: {
              excludedGranuleIds: ['G10000001-EDSC', 'G10000002-EDSC']
            }
          }
        },
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
      })

      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
    })
  })

  describe('editing project name', () => {
    test('when the state is editing the submit button is visible', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ isEditingName: true })

      expect(enzymeWrapper.find('.project-header__button--submit').length).toBe(1)
      expect(enzymeWrapper.find('.project-header__button--edit').length).toBe(0)
    })

    test('when the state is not editing the edit button is visible', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ isEditingName: false })

      expect(enzymeWrapper.find('.project-header__button--submit').length).toBe(0)
      expect(enzymeWrapper.find('.project-header__button--edit').length).toBe(1)
    })

    test('focusing the text field sets the state to editing', () => {
      const { enzymeWrapper } = setup()

      const input = enzymeWrapper.find('input')
      input.simulate('focus')

      expect(enzymeWrapper.state().isEditingName).toBeTruthy()
    })

    test('clicking the edit button sets the state to editing', () => {
      const { enzymeWrapper } = setup()

      const editButton = enzymeWrapper.find('.project-header__button--edit')
      editButton.simulate('click')

      expect(enzymeWrapper.state().isEditingName).toBeTruthy()
    })

    test('clicking the submit button calls onUpdateProjectName', () => {
      const { enzymeWrapper, props } = setup()

      const editButton = enzymeWrapper.find('.project-header__button--edit')
      editButton.simulate('click')

      const submitButton = enzymeWrapper.find('.project-header__button--submit')
      submitButton.simulate('click')

      expect(enzymeWrapper.state().isEditingName).toBeFalsy()
      expect(props.onUpdateProjectName).toBeCalledTimes(1)
      expect(props.onUpdateProjectName).toBeCalledWith('test project')
    })
  })
})
