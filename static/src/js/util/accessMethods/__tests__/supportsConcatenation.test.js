import { supportsConcatenation } from '../supportsConcatenation'

describe('supportsConcatenation', () => {
    describe('when concatenation is supported', () => {
        test('returns true', () => {
            const response = supportsConcatenation({
                conceptId: 'S100000-EDSC',
                serviceOptions: {
                    aggregation: {
                        concatenate: {
                            concatenateDefault: true
                        }
                    }
                }
            })

            expect(response).toBeTruthy()
        })
    })

    describe('when concatenation is not supported', () => {
        test('returns false', () => {
            const response = supportsConcatenation({
                conceptId: 'S100000-EDSC',
                serviceOptions: null
            })

            expect(response).toBeFalsy()
        })
    })
})
