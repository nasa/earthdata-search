#= require models/data/xhr_model

ns = @edsc.models.data

ns.DataQualitySummary = do (ko
                            KnockoutModel = @edsc.models.KnockoutModel
                            XhrModel=ns.XhrModel
                            ) ->
  class DataQualitySummaryModel extends XhrModel
    constructor: (query) ->
      super("/data_quality_summary.json", query)

    _toResults: (data) ->
      new DataQualitySummary(data)

  class DataQualitySummary extends KnockoutModel
    constructor: (jsonData) ->
      @summary = jsonData.data_quality_summary_definition.summary if jsonData
      @id = jsonData.data_quality_summary_definition.id if jsonData
      @name = jsonData.data_quality_summary_definition.name if jsonData
      @accepted = ko.observable(false)

  exports = DataQualitySummaryModel