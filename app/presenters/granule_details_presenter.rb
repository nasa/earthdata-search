class GranuleDetailsPresenter < DetailsPresenter
  def initialize(granule, granule_id=nil)
    @granule = granule
    @granule.id = granule_id
    puts @granule.inspect
    @granule.spatial = spatial(granule.spatial)
    @granule.temporal = temporal(granule.temporal)
    # @granule.measured_parameters = measured_parameters(granule.measured_parameters)

    metadata_url = "https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules/#{@granule.id}"
    @granule.native_url = "#{metadata_url}"
    @granule.atom_url = "#{metadata_url}.atom"
    @granule.echo10_url = "#{metadata_url}.echo10"
    @granule.iso19115_url = "#{metadata_url}.iso19115"
  end

  def measured_parameters(hash)
    if hash['MeasuredParameter']
      puts hash['MeasuredParameter'].inspect
      parameters = Array.wrap(hash['MeasuredParameter'].map do |param|
        puts param.inspect
        param['ParameterName']
      end)
    else
      parameters = ['Not available']
    end
    parameters
  end

end
