import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import { AdminRetrievalsForm } from '../AdminRetrievalsForm'

const setup = setupTest({
  Component: AdminRetrievalsForm,
  defaultProps: {
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn()
  }
})

describe('AdminRetrievalsForm component', () => {
  test('shows typed text in the input', async () => {
    const { user } = setup()

    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, 'some-value')

    expect(input).toHaveValue('some-value')
  })

  test('submits retrievalId search', async () => {
    const { props, user } = setup()

    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, 'retrieval-123')

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(props.onAdminViewRetrieval).toHaveBeenCalledTimes(1)
    expect(props.onAdminViewRetrieval).toHaveBeenCalledWith('retrieval-123')
    expect(props.onFetchAdminRetrievals).not.toHaveBeenCalled()
  })

  test('submits userId search', async () => {
    const { props, user } = setup()

    await user.selectOptions(screen.getByRole('combobox'), 'userId')

    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, 'test-user')

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(props.onFetchAdminRetrievals).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminRetrievals).toHaveBeenCalledWith('test-user', undefined)
    expect(props.onAdminViewRetrieval).not.toHaveBeenCalled()
  })

  test('submits retrievalCollectionId search', async () => {
    const { props, user } = setup()

    await user.selectOptions(screen.getByRole('combobox'), 'retrievalCollectionId')
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, '999')

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(props.onFetchAdminRetrievals).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminRetrievals).toHaveBeenCalledWith(undefined, '999')
    expect(props.onAdminViewRetrieval).not.toHaveBeenCalled()
  })
})
