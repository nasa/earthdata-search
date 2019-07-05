import isAccessMethodValid from '../accessMethods'

describe('isAccessMethodValid', () => {
  test('returns true is selected method is valid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection)).toBeTruthy()
  })

  test('returns false if the selected method is not valid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: false,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection)).toBeFalsy()
  })

  test('returns false if the selected method does not have isValid', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    }

    expect(isAccessMethodValid(projectCollection)).toBeFalsy()
  })

  test('returns false if no access method is selected', () => {
    const projectCollection = {
      accessMethods: {
        download: {
          isValid: true,
          type: 'download'
        }
      }
    }

    expect(isAccessMethodValid(projectCollection)).toBeFalsy()
  })

  test('returns false if no project collection config exists', () => {
    const projectCollection = undefined

    expect(isAccessMethodValid(projectCollection)).toBeFalsy()
  })
})
