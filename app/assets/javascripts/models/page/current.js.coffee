ns = @edsc.models.page

ns.setCurrent = do ($ = jQuery) ->

  exports = (model) ->

    $(document).ready ->
      ko.applyBindings(model)
      model.bindingsLoaded(true)
      $('#sitetourModal').modal('show') if model.ui.sitetour.safePath() && (model.preferences.doNotShowTourAgain() == 'false' || window.location.href.indexOf('?tour=true') != -1)


    @edsc.models.page.current = @edsc.page = model
