import history from './history'

export const addQueryParam = (query) => {
  console.warn('addQueryParam history', history)
  const location = Object.assign({}, history.getCurrentLocation())

  Object.assign(location.query, query)

  history.push(location)
}

export const removeQueryParam = (...queryKeys) => {
  console.warn('removeQueryParam history', history)
  const location = Object.assign({}, history.getCurrentLocation())

  queryKeys.forEach(queryKey => delete location.query[queryKey])

  history.push(location)
}
