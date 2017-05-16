
#= require modules/help
#= require models/data/preferences

ns = @edsc.models.ui
data = @edsc.models.data

ns.SiteTour = do (ko, help = @edsc.help, PreferencesModel = data.Preferences,  urlUtil=@edsc.util.url) ->
  class SiteTour
    constructor: ->
      @safePath = ko.observable(urlUtil.cleanPath()?.split('?')[0] in ["/search", "/", ""])

    startTour: () =>
      help.startTour()

    toggleHideTour: () =>
      newPreference = $('#toggleHideTour:checked').val() == 'on'
      preferences = new PreferencesModel()
      preferences.doNotShowTourAgain(newPreference.toString())
      preferences.save()
      
  exports = SiteTour
