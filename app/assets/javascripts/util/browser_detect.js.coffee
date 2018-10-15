@edsc.util.browser_detect = do ($=jQuery) ->

  init: () ->
    @browser = @searchString(this.dataBrowser) || "Other"
    @version = @searchVersion(navigator.userAgent) || @searchVersion(navigator.appVersion) || "Unknown"

    if (@browser == 'Explorer' && @version == 10)
      $('html').addClass 'lt-ie11'

    return {
      browser: @browser,
      version: @version
    }

  searchString: (data) ->
    for i in data
      dataString = i.string
      @versionSearchString = i.subString

      if (dataString.indexOf(i.subString) != -1)
        return i.identity

  searchVersion: (dataString) ->
    index = dataString.indexOf this.versionSearchString
    if (index == -1)
      return

    rv = dataString.indexOf "rv:"
    if (this.versionSearchString == "Trident" && rv != -1)
      return parseFloat dataString.substring(rv + 3)
    else
      return parseFloat dataString.substring(index + this.versionSearchString.length + 1)

  dataBrowser: [
      {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
      {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
      {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
      {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
      {string: navigator.userAgent, subString: "Opera", identity: "Opera"},
      {string: navigator.userAgent, subString: "OPR", identity: "Opera"},
      {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
      {string: navigator.userAgent, subString: "Safari", identity: "Safari"}
  ]

@edsc.util.browser_detect.init()
