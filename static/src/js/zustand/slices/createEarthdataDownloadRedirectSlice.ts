import { EarthdataDownloadRedirectSlice, ImmerStateCreator } from '../types'

const createEarthdataDownloadRedirectSlice:
    ImmerStateCreator<EarthdataDownloadRedirectSlice> = (set) => ({
      earthdataDownloadRedirect: {
        redirectUrl: '',
        setRedirectUrl: (redirect) => {
          set((state) => {
            state.earthdataDownloadRedirect.redirectUrl = redirect
          })
        }
      }
    })

export default createEarthdataDownloadRedirectSlice
