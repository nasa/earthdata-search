window.edsc.util.url = do(window, History) ->
  # The following regexp matches:
  # Everything up to the first comma followed by at least two slashes,
  # and everything thereafter until the next slash.  Basically the part
  # of the URL before the path
  root = window.location.href.match(/[^:]*:[\/]{2,}[^\/]*/)[0]

  # Given an application path, returns a full URL for that path.
  # Example: url('/datasets') -> 'http://localhost:3000/datasets'
  appPathToUrl = (appPath) ->
    "#{root}#{appPath}"

  # Given an application path, returns an absolute path for that path
  # Example: url('/datasets') -> '/some-container/datasets'
  appPathToPath = (appPath) ->
    appPath

  pushState = (appPath, title=window.document.title, data=null) ->
    History.pushState(data, title, appPathToUrl(appPath))

  replaceState = (appPath, title=window.document.title, data=null) ->
    History.replaceState(data, title, appPathToUrl(appPath))

  exports =
    appPathToUrl: appPathToUrl
    appPathToPath: appPathToPath
    pushState: pushState
    replaceState: replaceState
