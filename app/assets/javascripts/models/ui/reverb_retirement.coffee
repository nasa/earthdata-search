#= require util/js.cookies

ns = @edsc.models.ui
data = @edsc.models.data

ns.ReverbRetirement = do (ko) ->
  class ReverbRetirement
    constructor: ->

    referrerIsReverb: () =>
      # To semi-test locally, add "", "http://localhost:3000/search", to the array below (or whatever is appropriate for your local instance)
      reverb = ["", "http://localhost:3000/search", "http://echo-reverb-rails.dev", "https://testbed.echo.nasa.gov", "https://api-test.echo.nasa.gov", "https://testbed.echo.nasa.gov", "https://reverb.echo.nasa.gov"]
      return $.inArray(document.referrer, reverb) != -1 

    returnToReverb: () =>
      Cookies.set('ReadyForReverbRetirement', 'false', { expires: 90 })
      window.location.replace(document.referrer)
    
    stayWithEDSC: () =>
      Cookies.set('ReadyForReverbRetirement', 'true', { expires: 90 })
      $('#reverbRetirementModal').modal('hide')
    
  exports = ReverbRetirement
