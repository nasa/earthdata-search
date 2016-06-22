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
    submitError: (area, code) =>
      feedback.showForm({
        subject: "Earthdata Search error report #{code}",
        details: "\nFill in details above this line. Please try to be as specific as possible.\n--------------------\n\n[#{area}][#{code}]"}
      )

  exports = Feedback
