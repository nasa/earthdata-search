require "spec_helper"

describe "CWIC-capable collection search results", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :sit, facets: true
    wait_for_xhr
  end

  after :all do
    Capybara.reset_sessions!
  end

  context "in the collection results list" do
    before :all do
      login
      wait_for_xhr
    end

    context "when CWIC feature is not selected" do
      it "does not show CIWC-tagged items", acceptance: true do
        fill_in "keywords", with: 'C1000003579-GCMDTEST'
        wait_for_xhr
        expect(page).to have_content('0 Matching Collections')
      end
    end

    context "when CWIC feature is selected" do
      before :all do
        find("p.facets-item", text: "Int'l / Interagency").click
        wait_for_xhr
        fill_in "keywords", with: 'C1000003579-GCMDTEST'
        wait_for_xhr
      end

      after :all do
        load_page :search, env: :sit, facets: true
        wait_for_xhr
      end

      it "shows the CWIC tagged collection", acceptance: true do
        expect(first_collection_result).to have_content('3DIMG_L2P_IRW')
      end

      it "does not show a granule count", acceptance: true do
        expect(first_collection_result).to have_no_text('Granules')
      end

      it "displays an indication that its search and retrieval is provided externally", acceptance: true do
        expect(first_collection_result).to have_text("Int'l / Interagency")
      end
    end

    context "a non-CWIC-tagged item" do
      use_collection 'C3878-LPDAAC_ECS', 'MCD43A4'

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
        click_link 'Maximize'
      end

      context "a CWIC-tagged item" do
        before :all do
          find("p.facets-item", text: "Int'l / Interagency").click
          wait_for_xhr
          fill_in "keywords", with: 'C1000003579-GCMDTEST'
          wait_for_xhr
          first_collapsed_collection.click_link('Toggle details')
        end

        after :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        it "does not show a granule count" do
          expect(page).to have_no_selector('.flyout .badge-granule')
        end

        it "displays an indication that its search and retrieval is provided externally" do
          expect(page.find('.flyout')).to have_text("Int'l / Interagency")
        end
      end

      context "a non-CWIC-tagged item" do
        use_collection 'C3878-LPDAAC_ECS', 'MCD43A4'

        before :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        after :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        it "shows a granule count" do
          expect(page).to have_selector('.flyout .badge-granule')
        end

        it "displays no indication of external search and retrieval" do
          expect(page.find('.flyout')).to have_no_text('External')
        end
      end
    end
  end
end
