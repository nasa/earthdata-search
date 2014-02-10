# EDSC-188 As a user, I want to view GIBS tile imagery corresponding to my
#          search area on a map so that I may preview my results
# EDSC-193 As a user, I want to see information about which datasets have GIBS
#          support so I may understand why some datasets render differently

require "spec_helper"
require "date"

describe "Dataset GIBS visualizations", :reset => false do

  gibs_dataset_id = 'C1000000019-LANCEMODIS'
  gibs_dataset_product = 'MODIS_Terra_Aerosol'
  yesterday = (Date.today - 1).iso8601
  end_date = '2014-01-01 00:00:00'
  gibs_tile_layer = '.leaflet-tile-pane .leaflet-layer:nth-child(2)'

  before :all do
    visit "/search"
    fill_in "keywords", with: gibs_dataset_id
    wait_for_xhr
  end

  after :all do
    reset_search
    wait_for_xhr
  end

  context "when viewing a GIBS-enabled dataset in the results list" do
    it "indicates that the dataset has GIBS visualizations" do
      expect(first_dataset_result).to have_content('GIBS')
    end
  end

  context "when visualizing a GIBS-enabled dataset" do
    before :all do
      first_dataset_result.click_link "View dataset"
    end

    after :all do
      first_dataset_result.click_link "Hide dataset"
    end

    it "displays GIBS tiles from the previous day" do
      within gibs_tile_layer do
        src = page.find('img:first-child', visible: false)['src']
        expect(src).to match(/LAYER=#{gibs_dataset_product}/)
        expect(src).to match(/TIME=#{yesterday}/)
      end
    end

    context "with a temporal end date set" do
      before :all do
        page.evaluate_script("edsc.page.query.temporal().stop.humanDateString('#{end_date}')")
        wait_for_xhr
      end

      after :all do
        page.evaluate_script("edsc.page.query.temporal().stop.humanDateString(null)")
        wait_for_xhr
      end

      it "displays GIBS tiles from the temporal end date" do
        within gibs_tile_layer do
          src = page.find('img:first-child', visible: false)['src']
          expect(src).to match(/LAYER=#{gibs_dataset_product}/)
          expect(src).to match(/TIME=#{end_date.split.first}/)
        end
      end
    end
  end

  context "when turning off visualizations for a GIBS-enabled dataset" do
    before :all do
      first_dataset_result.click_link "View dataset"
      page.should have_css(gibs_tile_layer)
      first_dataset_result.click_link "Hide dataset"
    end

    it "removes the dataset's GIBS tiles from the map" do
      page.should have_no_css(gibs_tile_layer)
    end
  end
end
