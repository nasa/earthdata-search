import React from 'react'
import { render } from '@testing-library/react'

import AdminRetrieval from '../../../components/AdminRetrieval/AdminRetrieval'
import { AdminRetrievalContainer } from '../AdminRetrievalContainer'

jest.mock('../../../components/AdminRetrieval/AdminRetrieval', () => jest.fn(({ children }) => (
  <mock-AdminRetrieval data-testid="AdminRetrieval">
    {children}
  </mock-AdminRetrieval>
)))

describe('AdminRetrievalContainer component', () => {
  test('render AdminRetrieval with the correct props', () => {
    const onRequeueOrderMock = jest.fn()
    const props = {
      match: {
        params: {
          id: '1'
        }
      },
      onRequeueOrder: onRequeueOrderMock
    }

    const { rerender } = render((<AdminRetrievalContainer {...props} />))

    rerender((<AdminRetrievalContainer {...props} />))

    expect(AdminRetrieval).toHaveBeenCalledTimes(2)
    expect(AdminRetrieval).toHaveBeenNthCalledWith(1, {
      obfuscatedId: '1',
      onRequeueOrder: onRequeueOrderMock
    }, {})

    expect(AdminRetrieval).toHaveBeenNthCalledWith(2, {
      obfuscatedId: '1',
      onRequeueOrder: onRequeueOrderMock
    }, {})
  })
})
