import { urlPushAction } from 'react-url-query'
import { CHANGE_URL } from '../constants/actionTypes'

export const changeUrl = urlPushAction(CHANGE_URL, newQuery => ({ ...newQuery }))

export default changeUrl
