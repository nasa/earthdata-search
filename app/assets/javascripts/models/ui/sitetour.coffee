
#= require modules/help
#= require models/data/preferences

ns = @edsc.models.ui
data = @edsc.models.data

ns.SiteTour = do (help = @edsc.help, PreferencesModel = data.Preferences,  urlUtil=@edsc.util.url) ->
  class SiteTour
    startTour: () =>
      help.startTour()

    safePath: () =>
      safe = ["/search", "/", ""]
      return if urlUtil.cleanPath() then ($.inArray(urlUtil.cleanPath().split('?')[0], safe) > -1) else false

    toggleHideTour: () =>
      toggle = $('#toggleHideTour:checked').val()
      newPreference = if toggle=='on' then true else false
      preferences = new PreferencesModel()
      preferences.doNotShowTourAgain(newPreference)
      preferences.save()
      
  exports = SiteTour
