import { UPDATE_MAP } from '../constants/actionTypes'

export const updateMap = (payload) => ({
  type: UPDATE_MAP,
  payload
})

export const changeMap = (map) => (dispatch) => {
  dispatch(updateMap(map))
}
