ns = @edsc.models.ui

ns.ProjectList = do (ko, window) ->
  class ProjectList
    constructor: (@project, @user) ->
      @visible = ko.observable(false)

    showProject: =>
      @visible(true)

    hideProject: =>
      @visible(false)

    downloadDataset: (dataset) =>
      # send to data_access
      alert 'Download!'

    loginAndDownloadDataset: (dataset) =>
      if @user.isLoggedIn()
        @downloadDataset(dataset)
      else
        @user.loginCallback = =>
          @user.loginCallback = null
          @downloadDataset(dataset)

        @user.needsLogin(true)

  exports = ProjectList
