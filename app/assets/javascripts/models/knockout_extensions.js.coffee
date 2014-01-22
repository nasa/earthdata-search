do (ko) ->

  ko.observableArray.fn.contains = (obj) ->
    @indexOf(obj) != -1
