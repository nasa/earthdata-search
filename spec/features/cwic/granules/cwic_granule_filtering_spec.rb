require "spec_helper"

describe "CWIC Granule list", reset: false do
  extend Helpers::CollectionHelpers
  before_granule_count = 0

  context "for all collections with granules" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, q: 'USGS_EDC_EO1_ALI'
    end

    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    context "clicking on the 'Filter granules' button" do
      before :all do
        granule_list.find('.master-overlay-global-actions').click_link('Filter granules')
        expect(page).to have_css('#granule-search')
      end

      it "does not display the search by granule id fields", acceptance: true do
        expect(page).to have_no_content("Granule ID")
      end

      it "displays the collection-specific temporal fields", acceptance: true do
        expect(page).to have_css("#temporal_start_button")
        expect(page).to have_css("#temporal_end_button")
      end

      it "does not display the search by day/night flag field", acceptance: true do
        expect(page).to have_no_content("Day / Night Flag")
      end

      it "does not display the search by data access fields", acceptance: true do
        expect(page).to have_no_content("Find only granules that have browse images.")
        expect(page).to have_no_content("Find only granules that are available online.")
      end

      it "does not display the search by cloud cover percentage fields", acceptance: true do
        expect(page).to have_no_content("Cloud Cover")
      end

      context "and selecting temporal range" do
        before :all do
          number_granules = granule_list.text.match /\d+ matching granules/
          before_granule_count = number_granules.to_s.split(" ")[0].to_i
          fill_in "Start", with: "2010-02-02 00:00:00\t"
          fill_in "End", with: "2010-02-02 23:59:59\t"
          js_click_apply ".master-overlay-content"
          click_button "granule-filters-submit"
          wait_for_xhr
        end

        it "filters granules", acceptance: true do
          number_granules = granule_list.text.match /\d+ matching granules/
          after_granule_count = number_granules.to_s.split(" ")[0].to_i
          expect(after_granule_count < before_granule_count).to be_true
        end

        it "has query param 'pg[0][qt]' in the url", acceptance: true do
          expect(current_url).to include("pg[0][qt]=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.000Z")
        end
      end
    end
  end

  # The EO-1 collection used in acceptance testing doesn't have this issue. This is the only collection so far that shows
  # non-zero granule counts when granules are all filtered out due to an issue in the CWIC response "previous" link.
  # The link has an invalid negative "startIndex" query param when there is no granule results returned.
  context "Filtering out all granules of a CWIC collection" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, q: 'C1204461918-GCMDTEST', env: :uat
    end

    hook_granule_results('AIRCRAFT FLUX-RAW: UNIV. COL. (FIFE)')

    before :all do
      expect(page).to have_text("Showing 15 of 15 matching granules")
      granule_list.find('.master-overlay-global-actions').click_link('Filter granules')
      fill_in "Start", with: "1960-02-02 00:00:00\t"
      fill_in "End", with: "1960-02-02 23:59:59\t"
      js_click_apply ".master-overlay-content"
      click_button "granule-filters-submit"
      wait_for_xhr
    end

    it "shows 0 of 0 matching granules" do
      expect(page).to have_text("Showing 0 of 0 matching granules")
    end
  end
end
