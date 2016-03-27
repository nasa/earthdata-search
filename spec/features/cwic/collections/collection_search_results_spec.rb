require "spec_helper"

describe "CWIC-capable collection search results", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :uat, facets: true
  end

  after :all do
    Capybara.reset_sessions!
  end

  context "in the collection results list" do

    context "when CWIC feature is not selected" do
      it "does not show CIWC-tagged items", acceptance: true do
        fill_in "keywords", with: 'C1204449891-GCMDTEST'
        wait_for_xhr
        expect(page).to have_content('0 Matching Collections')
      end
    end

    context "when CWIC feature is selected" do
      before :all do
        cwic_feature_facet.click
        wait_for_xhr
        fill_in "keywords", with: 'C1204449891-GCMDTEST'
        wait_for_xhr
      end

      after :all do
        load_page :search, env: :uat, facets: true
      end

      it "shows the CWIC tagged collection", acceptance: true do
        expect(first_collection_result).to have_content('EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data')
      end

      it "does not show a granule count", acceptance: true do
        expect(first_collection_result).to have_no_text('Granules')
      end

      it "displays an indication that its search and retrieval is provided externally", acceptance: true do
        expect(first_collection_result).to have_text("Int'l / Interagency")
      end
    end

    context "a non-CWIC-tagged item" do
      use_collection 'C43947-GSFCS4PA', 'AIRIBRAD_NRT'

      it "shows a granule count", acceptance: true do
        expect(first_collection_result).to have_text('Granules')
      end

      it "displays no indication of external search and retrieval", acceptance: true do
        expect(first_collection_result).to have_no_text("Int'l / Interagency")
      end
    end

    context "in the collapsed collection results list" do
      before :all do
        click_link 'Minimize'
      end

      after :all do
        load_page :search, env: :uat, facets: true
      end

      context "a CWIC-tagged item" do
        before :all do
          cwic_feature_facet.click
          wait_for_xhr
          fill_in "keywords", with: 'C1204449891-GCMDTEST'
          wait_for_xhr
          first_collapsed_collection.click_link('Toggle details')
        end

        after :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        it "does not show a granule count", acceptance: true do
          expect(page).to have_no_selector('.flyout .badge-granule')
        end

        it "displays an indication that its search and retrieval is provided externally", acceptance: true do
          expect(page.find('.flyout')).to have_text("Int'l / Interagency")
        end
      end

      context "a non-CWIC-tagged item" do
        use_collection 'C43947-GSFCS4PA', 'AIRIBRAD_NRT'

        before :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        after :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        it "shows a granule count", acceptance: true do
          expect(page).to have_selector('.flyout .badge-granule')
        end

        it "displays no indication of external search and retrieval", acceptance: true do
          expect(page.find('.flyout')).to have_no_text('External')
        end
      end
    end
  end
end
