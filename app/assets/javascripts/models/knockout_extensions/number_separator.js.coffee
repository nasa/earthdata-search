do (ko, $=jQuery) ->

  ko.bindingHandlers.numberWithSeparator =
    update: (element, valueAccessor) ->
      originalText = ko.utils.unwrapObservable(valueAccessor())

      ko.bindingHandlers.text.update element, ->
        originalText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")