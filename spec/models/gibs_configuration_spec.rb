require 'spec_helper'

describe GibsConfiguration do
  context 'load_configs' do
    it 'merges custom configs into worldview configs' do
      mopit_config = {:collections=>{"condition"=>{"concept_id"=>"C6011924-LARC_ASDC"}}, :config=>{:match=>{"time_start"=>">=2000-03-01"}, :product=>"CERES_Terra_TOA_Window_Region_Flux_All_Sky_Monthly", :maxNativeZoom=>5, :title=>"TOA Window-Region Flux (Monthly, All-Sky)", :source=>"Terra / CERES", :format=>"png", :resolution=>"2km", :geo=>true, :arctic=>false, :antarctic=>false}}

      worldview_url = 'https://worldview.earthdata.nasa.gov/config/wv.json'
      gibs_configuration = GibsConfiguration.new
      result_json = gibs_configuration.send(:load_configs, worldview_url)

      expect(result_json.last).to eq(mopit_config)
    end
  end
end
