import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import ChunkedOrderModal from '../ChunkedOrderModal'

import configureStore from '../../../store/configureStore'

const store = configureStore()

function setup() {
  const props = {
    isOpen: true,
    location: {
      search: '?p=C100005-EDSC!C100005-EDSC&pg[1][v]=t'
    },
    projectCollectionsMetadata: {
      'C100005-EDSC': {
        title: 'collection title'
      }
    },
    projectCollectionsRequiringChunking: {
      'C100005-EDSC': {
        granules: {
          hits: 9001
        }
      }
    },
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn()
  }

  const history = createMemoryHistory()

  render(
    <Provider store={store}>
      <Router history={history} location={props.location}>
        <ChunkedOrderModal {...props} />
      </Router>
    </Provider>
  )

  return {
    history,
    onSubmitRetrieval: props.onSubmitRetrieval,
    onToggleChunkedOrderModal: props.onToggleChunkedOrderModal
  }
}

describe('ChunkedOrderModal component', () => {
  test('should render a title', () => {
    setup()

    expect(screen.getByTestId('edsc-modal__title')).toHaveTextContent('Per-order Granule Limit Exceeded')
  })

  test('should render instructions', () => {
    setup()

    expect(screen.getByTestId('chunked_order_message-0')).toHaveTextContent('The collection collection title contains 9,001 granules which exceeds the 2,000 granule limit configured by the provider. When submitted, the order will automatically be split into 5 orders.')
  })

  test('should render a \'Refine your search\' link that keeps the project params intact and removes the focused collection', async () => {
    const user = userEvent.setup()
    const { history } = setup()

    await user.click(screen.getByRole('button', { name: 'Refine your search' }))

    expect(history.location.pathname).toEqual('/search')
    expect(decodeURIComponent(history.location.search)).toContain('?p=!C100005-EDSC&pg[1][v]=t')
  })

  describe('modal actions', () => {
    test('\'Refine your search\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onToggleChunkedOrderModal } = setup()

      await user.click(screen.getByRole('button', { name: 'Refine your search' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Change access methods\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onToggleChunkedOrderModal } = setup()

      await user.click(screen.getByRole('button', { name: 'Change access methods' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Continue\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onSubmitRetrieval, onToggleChunkedOrderModal } = setup()

      await user.click(screen.getByRole('button', { name: 'Continue' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)

      expect(onSubmitRetrieval).toHaveBeenCalledTimes(1)
    })
  })
})
