ns = @edsc.models.ui

ns.ProjectList = do (ko, window) ->
  class ProjectList
    constructor: (@project) ->
      @visible = ko.observable(false)

    showProject: =>
      @visible(true)

    hideProject: =>
      @visible(false)

  exports = ProjectList
