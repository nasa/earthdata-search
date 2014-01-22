ns = @edsc.models.ui

ns.ProjectList = do (ko) ->
  class ProjectList
    constructor: (@project) ->
      @visible = ko.observable(false)

    showProject: =>
      @visible(true)

    hideProject: =>
      @visible(true)

  exports = ProjectList
