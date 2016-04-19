require "spec_helper"

describe "CWIC-enabled granule results", reset: false do
  extend Helpers::CollectionHelpers
  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :uat, ff: "Int'l / Interagency", q: 'C1204461918-GCMDTEST'
  end

  context "when viewing granule results for a CWIC-enabled collection" do
    hook_granule_results("AIRCRAFT FLUX-RAW: UNIV. COL. (FIFE)")

    context "clicking the button to remove a granule" do

      before :all do
        first_granule_list_item.click
        keypress('#granule-list', :delete)
        wait_for_xhr
      end

      it "removes it from the list", acceptance: true do
        expect(page).to have_css('#granule-list .panel-list-item', count: 14)
        expect(granule_list).to have_content("Showing 14 of 14 matching granules")
      end

      context "and updating the query" do
        before :all do
          visit current_url
          wait_for_xhr
        end

        it "continues to exclude the removed granule from the list", acceptance: true do
          expect(page).to have_css('#granule-list .panel-list-item', count: 14)
          expect(granule_list).to have_content("Showing 14 of 14 matching granules")
        end
      end
    end
  end
end