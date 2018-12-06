ns = @edsc.models.data

ns.Service = do (ko
                 DetailsModel = @edsc.models.DetailsModel
                 extend=jQuery.extend
                 ajax = @edsc.util.xhr.ajax
                 dateUtil = @edsc.util.date
                 config = @edsc.config
                 ) ->

  services = ko.observableArray()

  randomKey = Math.random()

  register = (service) ->
    service.reference()
    services.push(service)
    service

  class Service extends DetailsModel
    @awaitDatasources: (services, callback) ->
      callback(services)

    @findOrCreate: (jsonData, query) ->
      id = jsonData.meta['concept-id']

      for service in services()
        if service.meta()['concept-id'] == id
          if (jsonData.umm?.Name? && !service.hasAtomData())
            service.fromJson(jsonData)

          return service.reference()

      register(new Service(jsonData, query, randomKey))

    constructor: (jsonData, @query, inKey) ->
      throw "Services should not be constructed directly" unless inKey == randomKey
      
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
      @umm?['LongName'] || @umm?['Name']

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

  exports = Service
