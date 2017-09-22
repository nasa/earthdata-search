#= require util/js.cookies

ns = @edsc.models.ui
data = @edsc.models.data

ns.ReverbRetirement = do (ko) ->
  class ReverbRetirement
    constructor: ->

    referrerIsReverb: () =>
      referrer = document.referrer.match(/:\/\/(.[^/]+)/)[1];
      console.log "Checking referrer: " + referrer
      # To semi-test locally, add "", "localhost:3000", to the array below (or whatever is appropriate for your local instance)
      reverb = ["echo-reverb-rails.dev", "testbed.echo.nasa.gov", "api-test.echo.nasa.gov", "testbed.echo.nasa.gov", "reverb.echo.nasa.gov"]
      return $.inArray(document.referrer, reverb) != -1 

    returnToReverb: () =>
      Cookies.set('ReadyForReverbRetirement', 'false', { expires: 90 })
      # Strip out extra stuff to forward to reverb main page
      referrer = "https://" + document.referrer.match(/:\/\/(.[^/]+)/)[1];
      window.location.replace(referrer)
    
    stayWithEDSC: () =>
      Cookies.set('ReadyForReverbRetirement', 'true', { expires: 90 })
      $('#reverbRetirementModal').modal('hide')
    
  exports = ReverbRetirement
