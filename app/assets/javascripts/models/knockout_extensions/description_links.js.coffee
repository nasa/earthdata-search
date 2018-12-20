do (ko, $=jQuery) ->

  ko.bindingHandlers.descriptionLinks =
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
      description = $($.parseHTML(bindingContext.$data.description))
      for el, i in description
        if el.nodeName == 'A' && el.host != window.location.host
          $(el).attr('target', '_blank')
          $(el).addClass('ext')
          description[i] = el.outerHTML
        else if el.nodeName == 'A' && el.host == window.location.host
          description[i] = $(el.outerHTML).text()
        else
          description[i] = $(el).text()

      ko.applyBindingsToNode(element, { 'html': (el for el in description).join('')}, bindingContext)
