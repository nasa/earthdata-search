import history from './history'

export const addQueryParam = (query) => {
  const location = Object.assign({}, history.getCurrentLocation())

  Object.assign(location.query, query)

  history.push(location)
}

export const removeQueryParam = (...queryKeys) => {
  const location = Object.assign({}, history.getCurrentLocation())

  queryKeys.forEach(queryKey => delete location.query[queryKey])

  history.push(location)
}
