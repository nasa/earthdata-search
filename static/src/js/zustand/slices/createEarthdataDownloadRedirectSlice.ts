import { EarthdataDownloadRedirectSlice, ImmerStateCreator } from '../types'

const createEarthdataDownloadRedirectSlice:
    ImmerStateCreator<EarthdataDownloadRedirectSlice> = (set) => ({
      earthdataDownloadRedirect: {
        redirect: '',
        setRedirect: (redirect) => {
          set((state) => {
            state.earthdataDownloadRedirect.redirect = redirect
          })
        }
      }
    })

export default createEarthdataDownloadRedirectSlice
