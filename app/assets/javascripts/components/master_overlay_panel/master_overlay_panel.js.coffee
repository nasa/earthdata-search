do (ko) ->
  ko.components.register 'master-overlay-panel', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        panelGroups = ko.observableArray()
        activePanelGroup = ko.observable()

        return {
          panelGroups,
          activePanelGroup
        }
    }
    template: { element: 'tmpl_master-overlay-panel' },
  }

  ko.bindingHandlers.componentMasterOverlayPanel = {
      init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

        element = $(element)

        # Sets the currently active panelGroup by name
        bindingContext.$data.updateActivePanelGroup = (panelGroupName) ->
          bindingContext.$data.activePanelGroup(panelGroupName)

        # Sets isOpen to false on each of the panel groups
        bindingContext.$data.close = () ->
          for panelGroup in bindingContext.$data.panelGroups()
            elementContext = ko.contextFor panelGroup.element[0]
            bindingContext.$data.activePanelGroup(null)
            elementContext.$component.isOpen(false)
            # TL: Leaving this here intentionally. Experienceing some strange behavior with translate-origin.
            # Need to do some more poking, but dont want to lose the current state
            # $('.master-overlay-panel-indicator').removeClass('master-overlay-panel-indicator-active')

      update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
        # The element starts hidden to prevent the content from being seen. Once update is called, we know the dom is
        # in good shape and we can show the panels
        $(element).parent().show()
    }
