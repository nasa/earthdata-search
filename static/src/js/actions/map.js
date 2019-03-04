const changeMap = payload => (dispatch) => {
  dispatch({
    type: 'UPDATE_MAP_PARAM',
    payload
  })
}

export default changeMap
