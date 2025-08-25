import { screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleDownloadButton from '../GranuleDownloadButton'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn()
  }),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules',
    search: '?p=collectionId&ff=Map%20Imagery',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: GranuleDownloadButton,
  defaultProps: {
    authToken: 'token',
    badge: '294 Granules',
    buttonText: 'Download All',
    focusedCollectionId: 'collectionId',
    granuleCount: 294,
    granuleLimit: 1000000,
    initialLoading: false,
    isCollectionInProject: false,
    projectCollection: {},
    tooManyGranules: false,
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    project: {
      addProjectCollection: jest.fn()
    }
  },
  withRedux: true
})

describe('GranuleDownloadButton component', () => {
  describe('when there are too many granules', () => {
    test('renders a disabled button', () => {
      setup({
        overrideProps: {
          tooManyGranules: true
        }
      })

      const button = screen.getByRole('button', { name: 'Download All' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('granule-results-actions__download-all-button')
      expect(button).toHaveAttribute('disabled')
      expect(button).toHaveTextContent('Download All')
    })
  })

  describe('when the collection is already in the project', () => {
    test('clicking the button calls addProjectCollection and onChangePath', async () => {
      useLocation.mockReturnValueOnce({
        pathname: '/search/granules',
        search: '?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery'
      })

      const { props, user, zustandState } = setup({
        overrideProps: {
          isCollectionInProject: true
        }
      })

      const button = screen.getByRole('button', { name: 'Download All' })
      await user.click(button)

      expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery')
    })
  })

  describe('when the collection is not in the project', () => {
    describe('when there are no other pg parameters in the URL', () => {
      describe('when the user is not logged in', () => {
        test('clicking the button calls sets window.location.href to login', async () => {
          const { user, zustandState } = setup({
            overrideProps: {
              authToken: ''
            }
          })

          delete window.location
          window.location = {
            href: 'http://localhost',
            protocol: 'http:',
            host: 'localhost'
          }

          const button = screen.getByRole('button', { name: 'Download All' })
          await user.click(button)

          expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(0)

          expect(window.location.href).toEqual('http://localhost:3000/login?ee=prod&state=http%3A%2F%2Flocalhost%2Fprojects%3Fp%3DcollectionId!collectionId%26ff%3DMap%2520Imagery%26pg%5B1%5D%5Bv%5D%3Dt')
        })
      })

      test('clicking the button calls addProjectCollection and onChangePath', async () => {
        const { props, user, zustandState } = setup()

        const button = screen.getByRole('button', { name: 'Download All' })
        await user.click(button)

        expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
        expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&ff=Map%20Imagery&pg[1][v]=t')
      })
    })

    describe('when there are some pg parameters in the URL', () => {
      describe('when the user is not logged in', () => {
        test('clicking the button calls sets window.location.href to login', async () => {
          useLocation.mockReturnValueOnce({
            pathname: '/search/granules',
            search: '?p=collectionId&pg[0][gsk]=start_date&ff=Map%20Imagery'
          })

          const { user, zustandState } = setup({
            overrideProps: {
              authToken: ''
            }
          })

          delete window.location
          window.location = {
            href: 'http://localhost',
            protocol: 'http:',
            host: 'localhost'
          }

          const button = screen.getByRole('button', { name: 'Download All' })
          await user.click(button)

          expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(0)

          expect(window.location.href).toEqual('http://localhost:3000/login?ee=prod&state=http%3A%2F%2Flocalhost%2Fprojects%3Fp%3DcollectionId!collectionId%26pg%5B1%5D%5Bgsk%5D%3Dstart_date%26pg%5B1%5D%5Bv%5D%3Dt%26ff%3DMap%2520Imagery')
        })
      })

      test('clicking the button calls addProjectCollection and onChangePath', async () => {
        useLocation.mockReturnValueOnce({
          pathname: '/search/granules',
          search: '?p=collectionId&pg[0][gsk]=start_date&ff=Map%20Imagery'
        })

        const { props, user, zustandState } = setup()

        const button = screen.getByRole('button', { name: 'Download All' })
        await user.click(button)

        expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
        expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&pg[1][v]=t&ff=Map%20Imagery')
      })
    })
  })

  describe('when the database components are disabled', () => {
    test('the granule download button is disabled', () => {
      useLocation.mockReturnValueOnce({
        pathname: '/search/granules',
        search: '?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery'
      })

      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      setup({
        overrideProps: {
          isCollectionInProject: true
        }
      })

      const button = screen.getByRole('button', { name: 'Download All' })
      expect(button).toHaveAttribute('disabled')
    })
  })
})
