import setupTest from '../../../../../../vitestConfigs/setupTest'

import GranuleResultsBodyContainer from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'

vi.mock('../../../components/GranuleResults/GranuleResultsBody', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: GranuleResultsBodyContainer,
  defaultProps: {
    panelView: 'list'
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId'
    },
    query: {
      collection: {
        byId: {
          collectionId: {}
        }
      },
      changeGranuleQuery: vi.fn(),
      excludeGranule: vi.fn()
    }
  }
})

describe('GranuleResultsBodyContainer component', () => {
  test('passes its props and renders a single GranuleResultsBody component', () => {
    setup()

    expect(GranuleResultsBody).toHaveBeenCalledTimes(1)
    expect(GranuleResultsBody).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      directDistributionInformation: {},
      isOpenSearch: false,
      loadNextPage: expect.any(Function),
      panelView: 'list'
    }, {})
  })

  test('loadNextPage calls onChangeGranulePageNum', () => {
    const { zustandState } = setup()

    GranuleResultsBody.mock.calls[0][0].loadNextPage()

    expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      query: {
        pageNum: 2
      }
    })
  })
})
