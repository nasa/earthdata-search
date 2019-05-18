import Lambda from '../lambda'


describe('Lambda#transformRequest', () => {
  test('returns a basic example result correctly transformed', () => {
    const cwicRequest = new Lambda()

    const transformedData = cwicRequest.transformRequest({
      echoCollectionId: 'TEST_COLLECTION_ID'
    })

    // Our top level lambda object doesnt permit any keys, anything that inherits from
    // this class will need to white list the parmeters used.
    expect(transformedData).toEqual('{"params":{}}')
  })
})
