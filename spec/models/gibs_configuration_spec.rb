require 'rails_helper'

describe GibsConfiguration do
  before :all do
    # Loads WV json and merges in wv gibs.json
    worldview_url = 'https://worldview.earthdata.nasa.gov/config/wv.json'
    gibs_configuration = GibsConfiguration.new
    @result_json = gibs_configuration.send(:load_configs, worldview_url)
  end

  context 'load_configs' do
    it 'merges custom configs into final configs' do
      # This value only exists in our local gibs.json file
      local_only_title = 'Carbon Monoxide (Daily, Day, Total Column)'

      # Search for a known string that ONLY exists in local gibs.json
      local_only_config = @result_json.find { |config| config[:config][:title] == local_only_title }

      # Ensure that the local only value appears in the final merged result
      expect(local_only_config).to_not be_nil
    end

    it 'merges world configs into final configs' do
      # This value only exists in our local gibs.json file
      wv_only_title = 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'

      # Search for a known string that ONLY exists in wv gibs.json
      wv_only_config = @result_json.find { |config| config[:config][:product] == wv_only_title }

      # Ensure that the wv only value appears in the final merged result
      expect(wv_only_config).to_not be_nil
    end
  end
end
