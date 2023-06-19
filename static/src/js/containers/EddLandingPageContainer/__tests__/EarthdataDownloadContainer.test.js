import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EarthdataDownloadContainer } from '../EarthdataDownloadContainer'

jest.mock('../../../util/files/parseUserAgent', () => ({
  getOperatingSystem: jest.fn()
}))

const setup = () => {
  render(
    <EarthdataDownloadContainer> </EarthdataDownloadContainer>
  )
}

describe('EarthdataDownloadContainer component', () => {
  test('EarthdataDownloadContainer renders', async () => {
    await waitFor(async () => {
      setup()
    })
    const innerComponent = screen.getByRole('button')
    expect(innerComponent).toBeInTheDocument()
  })
})
