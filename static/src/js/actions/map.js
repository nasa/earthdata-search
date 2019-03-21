import { UPDATE_MAP } from '../constants/actionTypes'

export const updateMap = payload => ({
  type: UPDATE_MAP,
  payload
})

export const changeMap = mapParam => (dispatch) => {
  dispatch(updateMap({ ...mapParam }))
}
