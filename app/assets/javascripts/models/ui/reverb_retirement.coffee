

ns = @edsc.models.ui
data = @edsc.models.data

ns.ReverbRetirement = do (ko) ->
  class ReverbRetirement
    constructor: ->

    getCookie: (cname) =>
      name = cname + "=";
      decodedCookie = decodeURIComponent(document.cookie)
      ca = decodedCookie.split(';')
      i = 0
      while i < ca.length
        c = ca[i];
        while c.charAt(0) == ' ' 
          c = c.substring(1);
        if c.indexOf(name) == 0
          return c.substring(name.length, c.length)
        i++
      return "" 

    setReverbCookie: (value) =>
      d = new Date();
      d.setTime(d.getTime() + (60*24*60*60*1000)); # sets cookie for 60 days
      expires = "expires="+ d.toUTCString();
      document.cookie = "ReadyForReverbRetirement=" + value + ";" + expires + ";path=/";

    returnToReverb: () =>
      this.setReverbCookie("false")
      $('#reverbRetirementModal').modal('hide')
      window.location.replace(document.referrer)
    
    stayWithEDSC: () =>
      this.setReverbCookie("true")
      $('#reverbRetirementModal').modal('hide')
    
  exports = ReverbRetirement
