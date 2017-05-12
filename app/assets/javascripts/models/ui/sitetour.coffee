
#= require modules/help
#= require models/data/preferences

ns = @edsc.models.ui
data = @edsc.models.data

ns.SiteTour = do (help = @edsc.help, PreferencesModel = data.Preferences,  urlUtil=@edsc.util.url) ->
  class SiteTour
    startTour: () =>
      help.startTour()

    safePath: () =>
      console.log 'Safepath has: ' + urlUtil.cleanPath().split('?')[0] if urlUtil.cleanPath()
      console.log 'Safepath defaulted to false - urlUtil.cleanPath() was null' if !urlUtil.cleanPath()
      return if urlUtil.cleanPath() then (urlUtil.cleanPath().split('?')[0] == '/search' || urlUtil.cleanPath().split('?')[0] == '/') else false

    toggleHideTour: () =>
      toggle = $('#toggleHideTour:checked').val()
      newPreference = if toggle=='on' then true else false
      preferences = new PreferencesModel()
      preferences.doNotShowTourAgain(newPreference)
      preferences.save()
      
  exports = SiteTour
