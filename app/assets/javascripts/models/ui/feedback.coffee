#= require util/xhr
#= require util/url

ns = @edsc.models.ui

ns.Feedback = do (urlUtil = @edsc.util.url
                  ajax = @edsc.util.xhr.ajax) ->
  class Feedback
    showFeedback: (area, collectionId) =>
      area = "" unless area?
      collectionId = "" unless collectionId?
      prefix = if area == 'General' then "" else "[Metadata]"

      # Generate a new projectId for developer debugging
      projectId = ""
      path = urlUtil.cleanPath()
      data = {path: path}
      ajax
        method: 'post'
        dataType: 'text'
        url: "/projects?id=#{projectId}"
        data: data
        success: (data) ->
          projectId = data
          console.log "Created project #{projectId}"
          console.log "Path: #{path}"
        complete: ->
          feedback.showForm({subject: "#{prefix}[#{area}-#{collectionId}-#{projectId}]"})

      false

  exports = Feedback
