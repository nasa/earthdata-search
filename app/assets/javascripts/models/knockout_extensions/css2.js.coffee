do (ko, $=jQuery) ->

  # https://stackoverflow.com/questions/19256093/combine-dynamic-and-static-classes-through-css-binding-knockout-js/26116874#26116874
  ko.bindingHandlers['css2'] = ko.bindingHandlers.css
