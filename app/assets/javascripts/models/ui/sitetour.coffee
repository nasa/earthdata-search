
#= require modules/help
ns = @edsc.models.ui

ns.SiteTour = do (help = @edsc.help) ->
  class SiteTour
    startTour: () =>
      help.startTour()

  exports = SiteTour
