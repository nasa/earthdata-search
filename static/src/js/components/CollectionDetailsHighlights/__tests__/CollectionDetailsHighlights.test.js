import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionDetailsHighlights from '../CollectionDetailsHighlights'
import Skeleton from '../../Skeleton/Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionMetadata: {
      hasAllMetadata: true,
      doi: {
        doiLink: 'https://dx.doi.org/ADFD/DS456SD',
        doiText: 'ADFD/DS456SD'
      },
      temporal: [
        '1860-01-01 to 2050-12-31'
      ],
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.',
      versionId: '5'
    },
    collectionsSearch: {
      isLoaded: false,
      isLoading: true
    },
    location: {
      search: ''
    },
    onToggleRelatedUrlsModal: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionDetailsHighlights {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsHighlights component', () => {
  test('renders the component', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('collection-details-highlights')
  })

  describe('version', () => {
    describe('when collection is loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(0).find(Skeleton).length).toEqual(1)
      })
    })

    describe('when collection is loaded', () => {
      test('shows the version', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            isLoading: false,
            isLoaded: true
          }
        })
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(0).text()).toEqual('5')
      })
    })
  })

  describe('doi', () => {
    describe('when collection is loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(1).find(Skeleton).length).toEqual(1)
      })
    })

    describe('when collection is loaded', () => {
      test('shows the doi', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            isLoading: false,
            isLoaded: true
          }
        })
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(1).text()).toEqual('ADFD/DS456SD')
      })
    })
  })

  describe('temporal extent', () => {
    describe('when collection is loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(3).find(Skeleton).length).toEqual(1)
      })
    })

    describe('when collection is loaded', () => {
      test('shows the temporal extent', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            isLoading: false,
            isLoaded: true
          }
        })
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(3).text()).toEqual('1860-01-01 to 2050-12-31')
      })
    })
  })

  describe('abstract', () => {
    describe('when collection is loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(4).find(Skeleton).length).toEqual(1)
      })
    })

    describe('when collection is loaded', () => {
      test('shows the abstract', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            isLoading: false,
            isLoaded: true
          }
        })
        expect(enzymeWrapper.find('.collection-details-highlights__item-value').at(4).text())
          .toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.')
      })
    })
  })
})
