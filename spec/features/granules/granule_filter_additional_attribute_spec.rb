require "spec_helper"

describe "Granule search filters by additional attributes", reset: false do
  before_granule_count = 0

  xit "searching AST_L1T by CorrectionAchieved - additional attributes are no longer available"
  <<-eos
  before :all do
    page.driver.resize_window(2000, 3000) # Avoid having to scroll to click

    # No labs param here. The additional attributes should show up by default for AST_L1T.
    load_page :search, project: ['C1000000320-LPDAAC_ECS'], view: :project

    temporal_start_date = DateTime.new(1999, 12, 1, 0, 0, 0, '+0')
    temporal_stop_date = DateTime.new(2015, 1, 1, 0, 0, 0, '+0')
    set_temporal(temporal_start_date, temporal_stop_date)
    wait_for_xhr

    first_project_collection.click_link "Show granule filters"
    number_granules = project_overview.text.match /\d+ Granules/
    before_granule_count = number_granules.to_s.split(" ")[0].to_i
  end

  context "searching AST_L1T granules by CorrectionAchieved attribute" do
    before :all do
      fill_in('CorrectionAchieved', with: 'Precision')
      click_button "granule-filters-submit"
      wait_for_xhr
    end

    it "filters granules using the additional attribute value" do
      expect(project_overview).to filter_granules_from(before_granule_count)
    end
  end
eos

end
