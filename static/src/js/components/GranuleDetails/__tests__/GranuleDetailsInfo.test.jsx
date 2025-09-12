import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { granuleMetadata } from './mocks'

import GranuleDetailsInfo from '../GranuleDetailsInfo'
import Spinner from '../../Spinner/Spinner'

jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleDetailsInfo,
  defaultProps: {
    granuleMetadata
  }
})

describe('GranuleDetailsInfo component', () => {
  describe('when the metadata is not provided', () => {
    test('renders a loading state', () => {
      setup({
        overrideProps: {
          granuleMetadata: null
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        className: 'granule-details-info__spinner',
        size: 'small',
        type: 'dots'
      }, {})
    })
  })

  describe('when the metadata has been provided', () => {
    test('renders formatted granule details correctly', () => {
      setup()

      const element = screen.getByText(granuleMetadata.title, { exact: false })
      expect(element.textContent).toEqual(JSON.stringify(granuleMetadata, null, 2))
    })
  })
})
