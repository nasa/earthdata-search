require "spec_helper"

describe "Granule selection", reset: false do
  extend Helpers::CollectionHelpers
  Capybara.ignore_hidden_elements = true

  is_temporal_ordered_script = """
    (function() {
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
        result = layer._results[0].getTemporal() > layer._results[1].getTemporal() && layer._results[0].id != layer.stickyId;
      }
      return result;
    })();
    """

  is_granule_panel_visible_script = """
    (function() {
      var list = $('#granule-list .master-overlay-content.panel-list');
      var top = list.offset().top;
      var bottom = top + list.height() - 150;
      var selected = $('.panel-list-selected').offset().top;

      if (selected + 5 > top && selected - 5 < bottom) {
        return true;
      } else {
        return false;
      }
    })();
  """

  before :all do
    load_page :search, bounding_box: [0, 0, 15, 15], focus: 'C90757595-LAADS'
  end

  context "clicking on a granule in the result list" do
    before :all do
      # Click on a bottom one to test re-ordering
      nth_granule_list_item(10).click
      wait_for_xhr
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
      synchronize do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
      end
    end

    it "centers the map over the selected granule" do
      script = "$('#map').data('map').map.getCenter().toString()"
      result = page.evaluate_script script

      expect(result).to eq("LatLng(0, 0)")
    end

    it "zooms the map to the selected granule" do
      script = "$('#map').data('map').map.getZoom()"
      result = page.evaluate_script script

      expect(result).to eq(2)
    end

    context "pressing the up button" do
      before :all do
        keypress('#granule-list', :up)
      end
      after :all do
        keypress('#granule-list', :down)
      end

      it "highlights the previous granule" do
        expect(page).to have_css('.panel-list-list li:nth-child(9).panel-list-selected')
      end

      it "scrolls to the selected granule" do
        expect(page.evaluate_script(is_granule_panel_visible_script)).to be_true
      end

      it "centers the map over the selected granule" do
        script = "$('#map').data('map').map.getCenter().toString()"
        result = page.evaluate_script script

        expect(result).to eq("LatLng(0, 0)")
      end

      it "zooms the map to the selected granule" do
        script = "$('#map').data('map').map.getZoom()"
        result = page.evaluate_script script

        expect(result).to eq(2)
      end
    end

    context "pressing the down button" do
      before :all do
        keypress('#granule-list', :down)
      end
      after :all do
        keypress('#granule-list', :up)
      end

      it "highlights the next granule" do
        expect(page).to have_css('.panel-list-list li:nth-child(11).panel-list-selected')
      end

      it "scrolls to the selected granule" do
        expect(page.evaluate_script(is_granule_panel_visible_script)).to be_true
      end
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
      wait_for_xhr
      map_mouseclick(5, 5)
    end

    after :all do
      map_mouseclick(5, 5)
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
      synchronize do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
      end
    end

    it "scrolls to the selected granule" do
      expect(page.evaluate_script(is_granule_panel_visible_script)).to be_true
    end

    context "and clicking on it again" do
      before :all do
        wait_for_xhr
        map_mouseclick(5, 5)
      end

      after :all do
        map_mouseclick(5, 5)
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

    context "clicking the remove icon on the map" do
      before :all do
        within '#map' do
          click_link 'Exclude this granule'
        end
        find('#temporal-query').click # Ensure the capybara cursor is in a reasonable place
      end

      after :all do
        granule_list.click_link 'Filter granules'
        click_button "granule-filters-clear"
        granule_list.click_link('Hide granule filters')
        wait_for_xhr
        map_mouseclick(5, 5)
      end

      it "removes the granule from the list" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 19)
      end
    end
  end

end
