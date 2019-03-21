do (ko, $=jQuery) ->

  ko.bindingHandlers.echoform =
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->

    update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
      $el = $(element)

      queryString = if window.location.search && window.location.search.length then window.location.search.slice(1) else null;
      queryStringParams = if queryString then queryString.split('&') else []
      hasShapefile = false
      for i of queryStringParams
        if queryStringParams[i].startsWith('sf=')
          hasShapefile = true

      options = ko.unwrap(valueAccessor())
      methodName = options.method()
      if methodName?
        method = null
        for available in options.availableMethods
          if available.name == methodName
            method = available
            break
        if method? && available?.form?
          # TODO this should be set in 'options' and be sent to echoforms using "prepopulate" param.
          # EDSC-975: If the form contains an empty email address field, prepopulate it with the user's email
          if edsc.page.account
            available.form = available.form.replace('<ecs:email/>', '<ecs:email>' + edsc.page.account.email() + '</ecs:email>')
          originalForm = form = available.form
          model = if options.hasBeenReset then options.rawModelInitialValue else options.rawModel

          if model? && !options.isReadFromDefaults
            shortNameRegex = /<ecs:SUBAGENT_ID>[\s\S]*<ecs:value>(.*)<\/ecs:value>[\s\S]*<\/ecs:SUBAGENT_ID>/
            shortName = shortNameRegex.exec(model)?[1]

            form = form.replace(/(?:<instance>)(?:.|\n)*(?:<\/instance>)/, "<instance>\n#{model}\n</instance>")

          # Handle problems if the underlying form has a breaking change
          try
            $el.echoforms(form: form, prepopulate: options.prepopulatedFields())

          catch error
            console.log("Error caught rendering saved model, retrying:", error)
            form = originalForm
            $el.echoforms(form: form, prepopulate: options.prepopulatedFields())

          syncModel = ->
            isValid = $(this).echoforms('isValid')
            options.isValid(isValid)

            options.model = if options.hasBeenReset then options.modelInitialValue else $(this).echoforms('serialize')
            options.rawModel = if options.hasBeenReset then options.rawModelInitialValue else $(this).echoforms('serialize', prune: false)

            null
          $el.on 'echoforms:modelchange', syncModel
          syncModel.call($el)
        else
          options.isValid(true)
        options.isReadFromDefaults = true

      if !hasShapefile
        $useShapefile = $('[id*=spatial] :input[id*=use-shapefile-element]')
        $useShapefile.prop('disabled', true).parent().siblings('label').css('color','#aaa')
        $useShapefile.closest('.echoforms-elements').siblings('.echoforms-help').css('font-size','small')
          .html('Click <b>Back to Search Session</b> and upload a KML or Shapefile to enable this option.')

      null
