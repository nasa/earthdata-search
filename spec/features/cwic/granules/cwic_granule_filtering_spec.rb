require "spec_helper"

describe "CWIC Granule list", reset: false do
  extend Helpers::CollectionHelpers
  before_granule_count = 0

  context "for all collections with granules" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1200008589-GCMDTEST'
      login
      wait_for_xhr
    end

    hook_granule_results("OSTM/Jason-2 Level-2 Geophysical Data Records")

    context "clicking on the 'Filter granules' button" do
      before :all do
        granule_list.find('.master-overlay-global-actions').click_link('Filter granules')
        expect(page).to have_css('#granule-search')
      end

      after :all do
        collection_details.click_link('Back to Granules')
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

        it "filters granules" do
          number_granules = granule_list.text.match /\d+ matching granules/
          after_granule_count = number_granules.to_s.split(" ")[0].to_i
          expect(after_granule_count < before_granule_count).to be_true
        end

        it "has query param 'pg[0][qt]' in the url" do
          expect(current_url).to have_text("pg[0][qt]=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T22%3A59%3A59.000Z")
        end
      end
    end
  end
end
