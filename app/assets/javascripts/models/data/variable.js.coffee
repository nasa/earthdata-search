ns = @edsc.models.data

ns.Variable = do (ko
                 DetailsModel = @edsc.models.DetailsModel
                 extend=jQuery.extend
                 ajax = @edsc.util.xhr.ajax
                 dateUtil = @edsc.util.date
                 config = @edsc.config
                 ) ->

  variables = ko.observableArray()

  randomKey = Math.random()

  register = (variable) ->
    variable.reference()
    variables.push(variable)
    variable

  class Variable extends DetailsModel
    @awaitDatasources: (variables, callback) ->
      callback(variables)

    @findOrCreate: (jsonData, query) ->
      id = jsonData.meta['concept-id']

      for variable in variables()
        if variable.meta()['concept-id'] == id
          if (jsonData.umm?.Name? && !variable.hasAtomData())
            variable.fromJson(jsonData)

          return variable.reference()

      register(new Variable(jsonData, query, randomKey))

    constructor: (jsonData, @query, inKey) ->
      throw "Variables should not be constructed directly" unless inKey == randomKey
      
      @granuleCount = ko.observable(0)
      @hasAtomData = ko.observable(false)
      @fromJson(jsonData)

    notifyRenderers: (action) ->
      @_loadRenderers()
      if @_loading
        @_pendingRenderActions.push(action)
      else
        for renderer in @_renderers
          renderer[action]?()

    displayName: ->
      @umm()?['LongName'] || @umm()?['Name']

    toQueryParam: =>
      umm()?['Name'] + @getDimensions()

    getDimensions: ->
      ('[0:1:' + dimension['size'] + ']' for dimension in @variable().umm()['Dimensions']).join(':')

    fromJson: (jsonObj) ->
      @json = jsonObj

      @hasAtomData(jsonObj.umm?.Name?)

      @_setObservable('meta', jsonObj)
      @_setObservable('umm', jsonObj)
      @_setObservable('associations', jsonObj)

      for own key, value of jsonObj
        this[key] = value unless ko.isObservable(this[key])

      # @_loadDatasource()
    
    _setObservable: (prop, jsonObj) =>
      this[prop] ?= ko.observable(undefined)
      this[prop](jsonObj[prop] ? this[prop]())

  exports = Variable
