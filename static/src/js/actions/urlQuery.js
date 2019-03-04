import { urlReplaceInAction, UrlQueryParamTypes } from 'react-url-query'
import { CHANGE_KEYWORD_SEARCH } from '../constants/actionTypes'

const changeKeywordSearch = urlReplaceInAction(CHANGE_KEYWORD_SEARCH, 'q', UrlQueryParamTypes.string)

export default changeKeywordSearch
