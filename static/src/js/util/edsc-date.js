import moment from 'moment'

export const normalizeTime = (time) => {
  if (!time) return null
  return moment(time).utc().format('YYYY-MM-DD HH:mm:ss')
}

export const getTemporal = (start, end) => {
  const normStart = normalizeTime(start)
  const normEnd = normalizeTime(end)

  if (normStart === normEnd) return [normStart, null]
  if (!normEnd) return [normStart, null]
  if (!normStart) return [null, normEnd]
  return [normStart, normEnd]
}
