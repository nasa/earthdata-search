const isAnalyticsParam = (key: string) => {
  const normalizedKey = key.toLowerCase()

  return normalizedKey.startsWith('utm_')
    || normalizedKey === 'gclid'
    || normalizedKey === 'dclid'
}

export const preserveAnalyticsParams = (oldSearch: string, newSearch: string) => {
  const previousParams = new URLSearchParams(oldSearch)
  const nextParams = new URLSearchParams(newSearch)
  const additions = new URLSearchParams()

  previousParams.forEach((value, key) => {
    if (isAnalyticsParam(key) && !nextParams.has(key)) {
      additions.append(key, value)
    }
  })

  const addedSearch = additions.toString()

  return addedSearch ? [newSearch, addedSearch].filter(Boolean).join('&') : newSearch
}
