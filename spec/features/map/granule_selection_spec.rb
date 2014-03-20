require "spec_helper"

describe "Granule selection", reset: false, wait: 10 do
  extend Helpers::DatasetHelpers
  Capybara.ignore_hidden_elements = true

  is_temporal_ordered_script = """
      var layers = $('#map').data('map').map._layers, key, layer, result;
      for (key in layers) {
        if (layers[key]._getBackTile) {
          layer = layers[key];
          break;
        }
      }
      if (!layer) {
        result = true;
      }
      else {
        result = layer._results[0].getTemporal() > layer._results[1].getTemporal()
      }
      result;
    """


  before :all do
    visit "/search"
    create_bounding_box(0, 0, 15, 15)
  end

  use_dataset 'C1000000011-LANCEMODIS', 'MOD02QKM'
  hook_granule_results

  context "clicking on a granule in the result list" do
    before :all do
      # Click on a bottom one to test re-ordering
      nth_granule_list_item(10).click
    end

    after :all do
      nth_granule_list_item(10).click
    end

    it "highlights the selected granule in the granule list" do
      expect(granule_list).to have_selector('.panel-list-selected', count: 1)
    end

    it "highlights the selected granule on the map" do
      expect(page).to have_selector('#map path', count: 5)
    end

    it "displays a link to remove the granule in the granule list" do
      expect(granule_list).to have_selector('.panel-list-remove', count: 1)
    end

    it "displays a link to remove the granule on the map" do
      expect(page).to have_selector('#map .panel-list-remove', count: 1)
    end

    it "displays the granule's temporal extents on the map" do
      expect(page).to have_selector('.granule-spatial-label-temporal', count: 1)
    end

    it "displays the granule above all other granules" do
      expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
    end

    context "and clicking on it again" do
      before :all do
        nth_granule_list_item(10).click
      end

      after :all do
        nth_granule_list_item(10).click
      end

      it "removes added highlights and overlays from the granule result list" do
        expect(granule_list).to have_no_selector('.panel-list-selected')
        expect(granule_list).to have_no_selector('.panel-list-remove')
      end

      it "removes added highlights and overlays from the map" do
        expect(page).to have_selector('#map path', count: 3) # Just the spatial constraint and hover
        expect(page).to have_no_selector('#map .panel-list-remove')
        expect(page).to have_no_selector('.granule-spatial-label-temporal')
      end

      it "returns the granule ordering to its original state" do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_true
      end
    end
  end

  context "clicking on a granule on the map" do
    before :all do
      map_mouseclick
    end

    after :all do
      map_mouseclick
    end

    it "highlights the selected granule in the granule list" do
      expect(granule_list).to have_selector('.panel-list-selected', count: 1)
    end

    it "highlights the selected granule on the map" do
      expect(page).to have_selector('#map path', count: 3)
    end

    it "displays a link to remove the granule in the granule list" do
      expect(granule_list).to have_selector('.panel-list-remove', count: 1)
    end

    it "displays a link to remove the granule on the map" do
      expect(page).to have_selector('#map .panel-list-remove', count: 1)
    end

    it "displays the granule's temporal extents on the map" do
      expect(page).to have_selector('.granule-spatial-label-temporal', count: 1)
    end

    it "displays the granule above all other granules" do
      expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
    end

    context "and clicking on it again" do
      before :all do
        map_mouseclick
      end

      after :all do
        map_mouseclick
      end

      it "removes added highlights and overlays from the granule result list" do
        expect(granule_list).to have_no_selector('.panel-list-selected')
        expect(granule_list).to have_no_selector('.panel-list-remove')
      end

      it "removes added highlights and overlays from the map" do
        expect(page).to have_selector('#map path', count: 1) # Just the spatial constraint
        expect(page).to have_no_selector('#map .panel-list-remove')
        expect(page).to have_no_selector('.granule-spatial-label-temporal')
      end

      it "returns the granule ordering to its original state" do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_true
      end
    end
  end

end
