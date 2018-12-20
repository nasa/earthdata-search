do (ko, $=jQuery) ->

  # Truncate utility: http://jsfiddle.net/dima_k/bZEQM/1/
  ko.bindingHandlers.truncatedText = update: (element, valueAccessor, allBindingsAccessor) ->
    originalText = ko.utils.unwrapObservable(valueAccessor())
    length = ko.utils.unwrapObservable(allBindingsAccessor().maxLength) or 100
    truncatedText = if originalText.length > length then originalText.substring(0, length) + '...' else originalText
    # updating text binding handler to show truncatedText
    ko.bindingHandlers.text.update element, ->
      truncatedText
    return
