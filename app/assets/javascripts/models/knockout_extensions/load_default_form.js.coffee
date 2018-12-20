do (ko, $=jQuery) ->

  ko.bindingHandlers.loadDefaultForm =
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
      $el = $(element)
      if $el.data('echoforms')
        $el.echoforms('destroy')
        $el.off('echoforms:modelchange')
      options = ko.unwrap(valueAccessor())
      options.hasBeenReset = true
      methodName = options.method()
      if methodName?
        method = null
        for available in options.availableMethods
          if available.name == methodName
            method = available
            break

        if method? && available?.form?
          form = available.form
          $el.echoforms(form: form, prepopulate: options.prepopulatedFields())
          syncModel = ->
            isValid = $(this).echoforms('isValid')
            options.isValid(isValid)

            options.model = $(this).echoforms('serialize')
            options.rawModel = $(this).echoforms('serialize', prune: false)

            null
          $el.on 'echoforms:modelchange', syncModel
          syncModel.call($el)
        else
          options.isValid(true)
        options.isReadFromDefaults = true
