import { push } from 'connected-react-router'

export const changeUrl = url => (dispatch) => {
  dispatch(push(url))
}

export default changeUrl
