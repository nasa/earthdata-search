# EDSC-308: Corrected Reflectance Base Layer doesn't track temporal search bounds

require "spec_helper"

describe "Base layer date display", reset: false do

  before :all do
    visit '/search'
  end

  use_dataset('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
  hook_granule_results

end
