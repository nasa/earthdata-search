require "spec_helper"

describe "CWIC-enabled granule visualizations", reset: false do
  extend Helpers::CollectionHelpers

  context do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1000003579-GCMDTEST'
      login
      wait_for_xhr
    end

    hook_granule_results("INSAT-3D Imager Level-2P IR WINDS")

    context "viewing CWIC granule results with available browse imagery" do
      it "displays browse thumbnails for each granule with browse", acceptance: true do
        expect(granule_list).to have_css('a.panel-list-thumbnail-container img[src*="/preview_thumb/"]')
      end
    end

    context "selecting a CWIC granule result with available browse imagery" do
      before :all do
        first_granule_list_item.click
      end

      after :all do
        first_granule_list_item.click
      end

      it "displays a larger preview of the browse data", acceptance: true do
        expect(page).to have_css('#map .granule-browse a img[src*="/preview_thumb/"]')
      end

      context "clicking on the browse preview" do
        it "opens the full-size browse in a new tab", acceptance: true do
          link = find('#map .granule-browse a')

          expect(link['href']).to match(/.*\/preview\/.*/)
          expect(link['target']).to eq("_blank")
        end
      end
    end
  end
end
