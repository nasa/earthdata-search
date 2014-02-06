#= require models/page/search_page

ns = @edsc.models.page

ns.current = @edsc.page = do ($ = jQuery, SearchPageModel = ns.SearchPage) ->

  # We only have one page to worry about for now.  Eventually we'll have to
  # worry about loading the correct page.
  model = new SearchPageModel()

  $(document).ready ->
    ko.applyBindings(model)
    model.bindingsLoaded(true)

  exports = model
