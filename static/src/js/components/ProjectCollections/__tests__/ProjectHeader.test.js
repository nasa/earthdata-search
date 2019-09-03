import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectHeader from '../ProjectHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collections: {
      allIds: ['collectionId1'],
      byId: {
        collectionId1: {
          granules: {
            hits: 1,
            totalSize: { size: '4.0', unit: 'MB' }
          },
          metadata: {
            mock: 'data 1'
          }
        }
      }
    },
    project: {
      collectionIds: ['collectionId1']
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ProjectHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectHeader component', () => {
  test('renders its title correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('header').length).toBe(1)
    expect(enzymeWrapper.find('.project-header__title').text()).toEqual('Lorem Ipsum')
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
    const { enzymeWrapper } = setup({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            granules: {
              hits: 1,
              totalSize: { size: '4.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 1'
            }
          },
          collectionId2: {
            granules: {
              hits: 5,
              totalSize: { size: '5.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 2'
            }
          }
        }
      },
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    })

    test('renders collection count correctly', () => {
      expect(enzymeWrapper.find('.project-header__stats-item--collections').text()).toEqual('2 Collections')
    })

    test('renders collection size correctly', () => {
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
    const { enzymeWrapper } = setup({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            granules: {
              hits: 1,
              totalSize: { size: '4.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 1'
            }
          },
          collectionId2: {
            granules: {
              hits: 5,
              totalSize: { size: '5.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 2'
            }
          }
        }
      },
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    })

    test('renders granule count correctly', () => {
      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('6 Granules')
    })
  })

  describe('with multiple granule, some of which being excluded', () => {
    const { enzymeWrapper } = setup({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            granules: {
              hits: 1,
              totalSize: { size: '4.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 1'
            }
          },
          collectionId2: {
            excludedGranuleIds: ['G10000001-EDSC', 'G10000002-EDSC'],
            granules: {
              hits: 5,
              totalSize: { size: '5.0', unit: 'MB' }
            },
            metadata: {
              mock: 'data 2'
            }
          }
        }
      },
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    })

    test('renders granule count correctly', () => {
      expect(enzymeWrapper.find('.project-header__stats-item--granules').text()).toEqual('4 Granules')
    })
  })
})
