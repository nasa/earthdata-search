import moment from 'moment'

import isCustomTime from './datepicker'

export const formatDate = (value, timeOfDay) => {
  if (isCustomTime(value) || !value.isValid()) {
    console.log(`isCustomTime === true: ${value}`)

    return value
  }

  let dateMoment = null
  if (!moment.isMoment(value)) {
    dateMoment = moment.utc(value, moment.ISO_8601, true)
  } else {
    dateMoment = value.clone()
  }

  console.log(dateMoment)

  // eslint-disable-next-line no-underscore-dangle
  const format = dateMoment._f

  if (timeOfDay === 'end') {
    switch (format) {
      case 'YYYY':
        return dateMoment.endOf('year')
      case 'YYYY-MM':
        return dateMoment.endOf('month')
      case 'YYYY-MM-DD':
        return dateMoment.endOf('day')
      default:
        return dateMoment.endOf('day')
    }
  }

  return dateMoment
}

//   Const dateExpressions = [
//     {
//       // format: 'YYYY-MM',
//       regex: /^(\d{4}-\d{2})$/,
//       missing: 'day'
//     },
//     {
//       // format: 'YYYY-MM-DD',
//       regex: /^(\d{4}-\d{2}-\d{2})$/,
//       missing: 'hours'
//     },
//     {
//       // format: 'YYYY-MM-DD HH:MM',
//       regex: /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})$/,
//       missing: 'minutes'
//     },
//     {
//       // format: 'YYYY-MM-DD HH:MM:SS',
//       regex: /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/,
//       missing: null
//     }
//   ]

//   console.log('doin\' it')

//   const result = dateExpressions.filter((obj) => {
//     const {
//       regex
//     } = obj

//     return dateStr.match(regex)
//   })

//   const cleanedDateStr = result.map((obj) => {
//     const {
//       missing
//     } = obj

//     if (missing === null) {
//       return moment(dateStr).toISOString()
//     }

//     if (timeOfDay === 'start') {
//       return moment(dateStr).startOf(missing).utc(true).toISOString()
//     }

//     if (timeOfDay === 'end') {
//       return moment(dateStr).endOf(missing).utc(true).toISOString()
//     }

//     return dateStr
//   })

//   console.log(result)
//   console.log(cleanedDateStr)
//   console.log(dateStr)

//   return cleanedDateStr.length === 0 ? dateStr : cleanedDateStr[0]
// }
