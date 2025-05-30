import { EarthdataDownloadRedirectSlice, ImmerStateCreator } from '../types'

const createEarthdataDownloadRedirectSlice:
    ImmerStateCreator<EarthdataDownloadRedirectSlice> = (set) => ({
      earthdataDownloadRedirect: {
        redirectUrl: '',
        setRedirect: (redirect) => {
          set((state) => {
            state.earthdataDownloadRedirect.redirectUrl = redirect
          })
        }
      }
    })

export default createEarthdataDownloadRedirectSlice
