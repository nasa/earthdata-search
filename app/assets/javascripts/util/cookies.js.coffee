@edsc.util.cookies = do ->
  
  # https://gist.github.com/dmix/2222990
  setCookie = (name, value) ->
      document.cookie = "#{name}=#{escape(value)}; path=/;"

  readCookie = (name) ->
      nameEQ = name + "="
      ca = document.cookie.split(";")
      i = 0
      while i < ca.length
        c = ca[i]
        c = c.substring(1, c.length)  while c.charAt(0) is " "
        return c.substring(nameEQ.length, c.length).replace(/\"/g, '')  if c.indexOf(nameEQ) is 0
        i++
      null

  exports = 
    setCookie: setCookie
    readCookie: readCookie