import { act, waitFor } from '@testing-library/react'

import actions from '../../../actions'
import { UrlQueryContainer, mapDispatchToProps } from '../UrlQueryContainer'
import * as encodeUrlQuery from '../../../util/url/url'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import useEdscStore from '../../../zustand/useEdscStore'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules',
    search: '?p=C00001-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: UrlQueryContainer,
  defaultProps: {
    children: 'stuff',
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn()
  },
  defaultZustandState: {
    earthdataEnvironment: {
      currentEnvironment: 'prod'
    },
    preferences: {
      preferences: {
        collectionSort: 'default'
      }
    }
  }
})

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    collectionSearchResultsSortKey: collectionSortKeys.usageDescending
  }))
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('onChangeUrl calls actions.changeUrl', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeUrl')

    mapDispatchToProps(dispatch).onChangeUrl('query')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('query')
  })
})

describe('UrlQueryContainer', () => {
  describe('when the component mounts', () => {
    test('calls onChangePath', async () => {
      jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementationOnce(() => '?p=C00001-EDSC')

      const { props } = setup()

      await waitFor(async () => {
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
      })

      expect(props.onChangePath).toHaveBeenCalledWith('/search/granules?p=C00001-EDSC')
    })
  })

  describe('when the zustand values change', () => {
    test('calls onChangeUrl if the search params are the same', async () => {
      const encodeUrlQuerySpy = jest.spyOn(encodeUrlQuery, 'encodeUrlQuery')

      const { props } = setup()

      jest.clearAllMocks()

      await act(() => {
        useEdscStore.setState((state) => {
          // eslint-disable-next-line no-param-reassign
          state.collection.collectionId = 'C00001-EDSC'
          // eslint-disable-next-line no-param-reassign
          state.map.mapView.zoom = 8
        })
      })

      expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(2)
      expect(encodeUrlQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
        focusedCollection: 'C00001-EDSC',
        mapView: expect.objectContaining({
          zoom: 8
        })
      }))

      expect(props.onChangeUrl).toHaveBeenCalledTimes(1)
      expect(props.onChangeUrl).toHaveBeenCalledWith('/search/granules?p=C00001-EDSC&ee=prod&zoom=8')
    })
  })
})
