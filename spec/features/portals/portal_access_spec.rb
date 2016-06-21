require "spec_helper"

describe "Portal access", reset: false do
  include Helpers::CollectionHelpers

  collection_name = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  def visit_and_download(filters={})
    collection_id = 'C90762182-LAADS'
    collection_name = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'
    load_page :search, {q: collection_id}.merge(filters)
    login
    view_granule_results(collection_name)
    within(first_granule_list_item) do
      click_on('Retrieve single granule data')
    end
    wait_for_xhr
    choose 'Download'
    click_on 'Submit'
    wait_for_xhr
  end

  before :all do
    AccessConfiguration.destroy_all
    Retrieval.destroy_all
  end

  context "Visiting an Earthdata Search portal, accessing data" do
    before :all do
      Capybara.reset_sessions!
      visit_and_download(portal: 'simple')
    end

    after :all do
      AccessConfiguration.destroy_all
      Retrieval.destroy_all
    end

    context "visiting the main Earthdata Search site's recent retrievals page" do
      before :all do
        load_page '/data/status'
      end

      it "shows the retrieval", acceptance: true do
        expect(page).to have_link(collection_name)
      end

      context "clicking on the retrieval" do
        before :all do
          click_link collection_name
        end

        it "returns the user to the portal", acceptance: true do
          expect(page).to have_path_prefix("/portal/simple")
        end
      end
    end
  end

  context "Visiting Earthdata Search, accessing data" do
    before :all do
      Capybara.reset_sessions!
      visit_and_download()
    end

    after :all do
      AccessConfiguration.destroy_all
      Retrieval.destroy_all
    end

    context "visiting an Earthdata Search portal's recent retrievals page" do
      before :all do
        load_page '/data/status', portal: 'simple'
      end

      it "shows the retrieval", acceptance: true do
        expect(page).to have_link(collection_name)
      end

      context "clicking on the retrieval" do
        before :all do
          click_link collection_name
        end

        it "returns the user to the main site", acceptance: true do
          expect(page).to have_no_path_prefix("/portal")
        end
      end
    end
  end
end
