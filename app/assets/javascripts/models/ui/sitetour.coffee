
#= require modules/help
#= require models/data/preferences

ns = @edsc.models.ui
data = @edsc.models.data

ns.SiteTour = do (help = @edsc.help, PreferencesModel = data.Preferences,  urlUtil=@edsc.util.url) ->
  class SiteTour
    startTour: () =>
      help.startTour()

    safePath: () =>
      return if urlUtil.cleanPath() then urlUtil.cleanPath().split('?')[0] == '/search' else false

    toggleHideTour: () =>
      toggle = $('#toggleHideTour:checked').val()
      newPreference = if toggle=='on' then true else false
      preferences = new PreferencesModel()
      preferences.doNotShowTourAgain(newPreference)
      preferences.save()
      
  exports = SiteTour
