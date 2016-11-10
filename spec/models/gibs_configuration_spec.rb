require 'spec_helper'

describe GibsConfiguration do
  context 'load_configs' do
    it 'merges custom configs into worldview configs' do
      mopit_config = {:collections=>{"condition"=>{"concept_id"=>"C84942916-LARC"}}, :config=>{:match=>{"time_start"=>">=2000-02-01"}, :product=>"MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-2.0km_Monthly", :maxNativeZoom=>5, :title=>"Cloud Stereo Height (No Wind Correction, 1.5 - 2.0 km, Monthly)", :source=>"Terra / MISR", :format=>"png", :resolution=>"2km", :geo=>true, :arctic=>false, :antarctic=>false, :geo_resolution=>"2km", :arctic_resolution=>nil, :antarctic_resolution=>nil}}

      worldview_url = 'https://worldview.earthdata.nasa.gov/config/wv.json'
      gibs_configuration = GibsConfiguration.new
      result_json = gibs_configuration.send(:load_configs, worldview_url)

      expect(result_json.last).to eq(mopit_config)
    end
  end
end
