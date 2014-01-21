ns = @edsc.models.ui

ns.DatasetsList = do ->
  class DatasetsList
    constructor: (@query, @datasets) ->

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

  exports = DatasetsList