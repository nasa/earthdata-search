require "spec_helper"

describe "CWIC-enabled granule visualizations", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, q: 'C1220566654-USGS_LTA'
  end

  context "viewing CWIC granule results" do
    before :all do
      view_granule_results 'EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data'
      first_granule_list_item.click_link('View granule details')
      wait_for_xhr
    end

    it "displays a clear indication that fine-grained timeline information is unavailable on the timeline", acceptance: true do
      page.execute_script('$(".timeline-indeterminate").children().trigger("mouseover");')
      expect(page).to have_content('Specific Ranges Unavailable')
      page.execute_script('$(".timeline-indeterminate").children().trigger("mouseout");')
      expect(page).to have_selector('.timeline-data.timeline-indeterminate')
    end

    it "shades the temporal extent of the parent collection on the timeline to indicate the general range of data", acceptance: true do
      page.execute_script('$(".timeline-indeterminate").children().trigger("mouseover");')
      expect(page).to have_content('16 Mar 2001 to 01 Mar 2014')
      page.execute_script('$(".timeline-indeterminate").children().trigger("mouseout");')

    end

  end
end
