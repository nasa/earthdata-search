import moment from 'moment'

const isCustomTime = (momentObj) => {
  if (!moment.isMoment(momentObj)) return true

  const selectedDate = moment(momentObj)
  const startOfSelectedDate = moment(selectedDate).clone().startOf('day')
  const endOfSelectedDate = moment(selectedDate).clone().endOf('day')

  return !selectedDate.isSame(startOfSelectedDate, 'second')
    && !selectedDate.isSame(endOfSelectedDate, 'second')
}

export default isCustomTime
