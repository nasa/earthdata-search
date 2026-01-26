import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCImage from '../../EDSCImage/EDSCImage'
import GranuleResultsBrowseImageCell from '../GranuleResultsBrowseImageCell'

vi.mock('../../EDSCImage/EDSCImage', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: GranuleResultsBrowseImageCell,
  defaultProps: {
    row: {
      original: {}
    }
  }
})

describe('GranuleResultsBrowseImageCell component', () => {
  describe('when no image is passed', () => {
    test('renders itself correctly', () => {
      setup()

      expect(EDSCImage).toHaveBeenCalledTimes(0)
    })
  })

  describe('browse flag is false', () => {
    test('renders itself correctly', () => {
      setup({
        overrideProps: {
          row: {
            original: {
              browseFlag: false,
              granuleThumbnail: 'http://someplace.com/src/image.jpg'
            }
          }
        }
      })

      expect(EDSCImage).toHaveBeenCalledTimes(0)
    })
  })

  describe('when given a valid image', () => {
    test('renders itself correctly', () => {
      setup({
        overrideProps: {
          row: {
            original: {
              browseFlag: true,
              granuleThumbnail: 'http://someplace.com/src/image.jpg'
            }
          }
        }
      })

      expect(EDSCImage).toHaveBeenCalledTimes(1)
      expect(EDSCImage).toHaveBeenCalledWith({
        alt: 'Browse Image for undefined',
        className: 'granule-results-browse-image-cell__thumb-image',
        height: 60,
        isBase64Image: true,
        src: 'http://someplace.com/src/image.jpg',
        width: 60
      }, {})
    })
  })

  describe('when given a valid image and browse url', () => {
    test('renders itself correctly', () => {
      setup({
        overrideProps: {
          row: {
            original: {
              browseFlag: true,
              browseUrl: 'http://someplace.com/browse/link',
              granuleThumbnail: 'http://someplace.com/src/image.jpg'
            }
          }
        }
      })

      expect(EDSCImage).toHaveBeenCalledTimes(1)
      expect(EDSCImage).toHaveBeenCalledWith({
        alt: 'Browse Image for undefined',
        className: 'granule-results-browse-image-cell__thumb-image',
        height: 60,
        isBase64Image: true,
        src: 'http://someplace.com/src/image.jpg',
        width: 60
      }, {})

      const link = screen.getByRole('link', { name: 'View image' })
      expect(link.href).toEqual('http://someplace.com/browse/link')
    })
  })
})
