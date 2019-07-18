import { getFieldElementValue } from './getFieldElementValue'

const booleanTranslations = {
  true: 'Y',
  True: 'Y',
  TRUE: 'Y',
  y: 'Y',
  Y: 'Y',
  false: 'N',
  False: 'N',
  FALSE: 'N',
  n: 'N',
  N: 'N'
}

export const getSwitchFields = (xmlDocument) => {
  const switchFields = ['INCLUDE_META']

  const switchFieldValues = {}

  switchFields.forEach((field) => {
    switchFieldValues[field] = booleanTranslations[getFieldElementValue(xmlDocument, field).trim()]
  })

  return switchFieldValues
}
