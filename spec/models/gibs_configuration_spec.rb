require 'spec_helper'

describe GibsConfiguration do
  context 'load_configs' do
    it 'merges custom configs into worldview configs' do
      mopit_config = {:collections=>{"condition"=>{"or"=>[{"concept_id"=>"C191855458-LARC"}, {"concept_id"=>"C40204-ECHO10_PT"}]}}, :config=>{:match=>{"time_start"=>">=2000-03-03"}, :product=>"MOPITT_CO_Daily_Total_Column_Day", :maxNativeZoom=>5, :title=>"Carbon Monoxide (Daily, Day, Total Column)", :source=>"Terra / MOPITT", :format=>"png", :resolution=>"2km", :geo=>true, :arctic=>false, :antarctic=>false}}

      worldview_url = 'https://worldview.earthdata.nasa.gov/config/wv.json'
      gibs_configuration = GibsConfiguration.new
      result_json = gibs_configuration.send(:load_configs, worldview_url)

      expect(result_json.last).to eq(mopit_config)
    end
  end
end
