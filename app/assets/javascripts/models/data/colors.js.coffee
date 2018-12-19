#= require models/data/xhr_model
#= require models/data/variable

ns = @edsc.models.data

ns.Colors = do () ->

  class ColorsModel
    constructor: () ->
      # Defines the color values for collections
      @collections = ko.observableArray([
          '#3498DB', # Blue
          '#E67E22', # Orange
          '#2ECC71', # Green
          '#E74C3C', # Red
          '#9B59B6'  # Purple
        ])

  exports = ColorsModel
