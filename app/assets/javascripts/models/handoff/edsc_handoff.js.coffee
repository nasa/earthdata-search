ns = @edsc.models.handoff

ns.EdscHandoff = do (ko) ->

  class EdscHandoff
    constructor: (query, collection) ->
      @query = query

      @temporal = @query.temporal.applied
      @spatial  = @query.spatial()
      @keywords = @query.keywords()      

      @collection = collection

    getProviderRootUrl: -> 
      throw 'Method getProviderRootUrl not implemented.'

    getProviderName: ->
      throw 'Method getProviderName not implemented.'

    getProviderUrl: ->
      throw 'Method getProviderUrl not implemented.'

  exports = EdscHandoff
