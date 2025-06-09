import { LocationSlice, ImmerStateCreator } from '../types'

// const { pathname, search } = window.location

const createLocationSlice: ImmerStateCreator<LocationSlice> = (set) => ({
  location: {
    // location: {
    //   pathname,
    //   search
    // },
    // setLocation: (location) => {
    //   set((state) => {
    //     state.location.location = location
    //   })
    // },
    navigate: () => {},
    setNavigate: (navigate) => {
      set((state) => {
        state.location.navigate = navigate
      })
    }
  }
})

export default createLocationSlice
