do (ko, $=jQuery) ->

  # http://www.knockmeout.net/2012/05/quick-tip-skip-binding.html
  ko.bindingHandlers.stopBinding =
    init: ->
      controlsDescendantBindings: true
  ko.virtualElements.allowedBindings.stopBinding = true
