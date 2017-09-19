#= require util/js.cookies

ns = @edsc.models.ui
data = @edsc.models.data

ns.ReverbRetirement = do (ko) ->
  class ReverbRetirement
    constructor: ->

    returnToReverb: () =>
      Cookies.set('ReadyForReverbRetirement', 'false', { expires: 90 })
      $('#reverbRetirementModal').modal('hide')
      window.location.replace(document.referrer)
    
    stayWithEDSC: () =>
      Cookies.set('ReadyForReverbRetirement', 'true', { expires: 90 })
      $('#reverbRetirementModal').modal('hide')
    
  exports = ReverbRetirement
