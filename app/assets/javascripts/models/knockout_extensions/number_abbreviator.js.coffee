do (ko, $=jQuery) ->

  # Convert large numbers to their abbreviated forms. If numbers reach the
  # thousands spot, add commas where appropriate
  # 
  # abbreviateNumber(12 , 1)          => 12
  # abbreviateNumber(0 , 2)           => 0
  # abbreviateNumber(1234 , 0)        => 1k
  # abbreviateNumber(34567 , 2)       => 34.57k
  # abbreviateNumber(918395 , 1)      => 918.4k
  # abbreviateNumber(2134124 , 2)     => 2.13M
  # abbreviateNumber(47475782130 , 2) => 47.48B
  # 
  # https://stackoverflow.com/a/2901298

  ko.bindingHandlers.abbreviateNumber =
    update: (element, valueAccessor) ->
      originalText = ko.utils.unwrapObservable(valueAccessor())
      # originalText = value.text

      decPlaces = 1

      # 2 decimal places => 100, 3 => 1000, etc
      decPlaces = Math.pow(10, decPlaces)

      # Enumerate number abbreviations
      abbrev = [ "k", "M", "B", "T" ]

      # Go through the array backwards, so we do the largest first
      for i in [abbrev.length-1..0]
        # Convert array index to "1000", "1000000", etc
        size = Math.pow(10,(i+1)*3)

        number = parseInt(originalText)

        # If the number is bigger or equal do the abbreviation
        if(size <= number)
          # Here, we multiply by decPlaces, round, and then divide by decPlaces.
          # This gives us nice rounding to a particular decimal place.
          number = Math.round(number * decPlaces / size) / decPlaces

          # Handle special case where we round up to the next abbreviation
          if((number == 1000) && (i < abbrev.length - 1))
            number = 1
            i++

          # Add the letter for the abbreviation
          number += abbrev[i]

          # We are done... stop
          break

      ko.bindingHandlers.text.update element, ->
        # https://stackoverflow.com/a/2901298
        number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
