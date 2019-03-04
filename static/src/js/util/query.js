import { browserHistory } from 'react-router'

export const addQueryParam = (query) => {
  const location = Object.assign({}, browserHistory.getCurrentLocation())

  Object.assign(location.query, query)

  browserHistory.push(location)
}

export const removeQueryParam = (...queryKeys) => {
  const location = Object.assign({}, browserHistory.getCurrentLocation())

  queryKeys.forEach(queryKey => delete location.query[queryKey])

  browserHistory.push(location)
}
