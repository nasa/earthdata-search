ns = @edsc.models.handoff

ns.EdscHandoff = do (ko) ->

  class EdscHandoff
    constructor: (query, collection, project) ->
      @query = query

      @temporal   = @query.temporal.applied
      @spatial    = @query.spatial()
      @keywords   = @query.keywords()      
      @collection = collection

      # If no project was provided there is nothing additional to extract
      if project
        # All data selected on the project page lives within the projectCollection
        @projectCollection = project.getProjectCollection(@collection.id)
        @variables         = @projectCollection.selectedVariables()

    getProviderRootUrl: -> 
      throw 'Method getProviderRootUrl not implemented.'

    getProviderName: ->
      throw 'Method getProviderName not implemented.'

    getProviderUrl: ->
      throw 'Method getProviderUrl not implemented.'

  exports = EdscHandoff
