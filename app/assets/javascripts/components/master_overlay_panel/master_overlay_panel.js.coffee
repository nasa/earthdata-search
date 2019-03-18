do (ko) ->
  ko.components.register 'master-overlay-panel', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        panelGroups = ko.observableArray()
        activePanelGroup = ko.observable()
        activeCollectionId = ko.observable()
        firstRender = ko.observable(true)
        allPanelsRendered = ko.observable(false)

        return {
          panelGroups,
          activePanelGroup,
          activeCollectionId,
          firstRender,
          allPanelsRendered
        }
    }
    template: { element: 'tmpl_master-overlay-panel' },
  }

  ko.bindingHandlers.componentMasterOverlayPanel = {
      init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

        element = $(element)

        bindingContext.$data.activePanelGroup.subscribe (data) ->
          bindingContext.$root.ui.projectList.projectPanelIsOpen(!!data)

        # Sets the currently active panelGroup by name
        bindingContext.$data.updateActivePanelGroup = (panelGroupName) ->
          bindingContext.$data.activePanelGroup(panelGroupName)

          # To set the collection ID, we split off the last element of the panel ID
          bindingContext.$root.ui.projectList.projectPanelCollectionId(panelGroupName.split('_').splice(0, panelGroupName.split('_').length - 1).join('_'))

        # Sets isOpen to false on each of the panel groups
        bindingContext.$data.close = () ->
          for panelGroup in bindingContext.$data.panelGroups()
            elementContext = ko.contextFor panelGroup.element[0]
            bindingContext.$data.activePanelGroup(null)
            elementContext.$component.isOpen(false)

      update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
        # The element starts hidden to prevent the content from being seen. Once update is called, we know the dom is
        # in good shape and we can show the panels

        hasRendered = (collection) =>
          ko.contextFor(collection.element?[0]).$data.allItemsRendered()

        # Once all panels have registered as rendered, show the element and open the panel
        bindingContext.$data.allPanelsRendered(bindingContext.$data.panelGroups().length && bindingContext.$data.panelGroups().every(hasRendered))

        if bindingContext.$data.firstRender() and \
           bindingContext.$data.allPanelsRendered()

          bindingContext.$data.firstRender(false)
          $(element).parent().show()
          $('#' + bindingContext.$parent.project.collections()[0]?.collection.id + '_edit-options').trigger('toggle-panel')
    }
