#= require util/xhr
#= require util/url

ns = @edsc.models.ui

ns.Feedback = do (urlUtil = @edsc.util.url
                  ajax = @edsc.util.xhr.ajax) ->
  class Feedback
    showFeedback: (area, collectionId) =>
      if area == 'General'
        feedback.showForm()
      else
        feedback.showForm({subject: "[Metadata][#{area}]"})
      false

  exports = Feedback
