import { mapDispatchToProps } from '../BackButtonContainer'

import actions from '../../../actions'

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/search')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('/search')
  })
})
