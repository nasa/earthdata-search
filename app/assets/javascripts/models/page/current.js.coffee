ns = @edsc.models.page

ns.setCurrent = do ($ = jQuery) ->

  exports = (model) ->

    $(document).ready ->
      ko.applyBindings(model)
      model.bindingsLoaded(true)

    @edsc.models.page.current = @edsc.page = model
