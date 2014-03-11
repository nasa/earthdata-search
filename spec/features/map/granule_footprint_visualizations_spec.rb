# EDSC-86 As a user, I want to view polygon spatial extents on a map so that I
#         may understand the location and shape of my results
# EDSC-88 As a user, I want to view point spatial extents on a map so that I may
#         understand the location and shape of my results
# EDSC-90 As a user, I want to view rectangular spatial extents on a map so that
#         I may understand the location and shape of my results

require "spec_helper"

describe "Granule footprint visualizations", reset: false, wait: 30 do
  extend Helpers::DatasetHelpers

  before :all do
    visit "/search"
  end

  context "for point datasets" do
    use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data'

    context "visualizing a dataset's granules" do
      hook_granule_results

      it "draws a single point on the map representing all of the dataset's granules" do
        expect(page).to have_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end

      context "and mousing over a visualized granule" do
        before :all do
          map_mousemove('#map', 39.1, -96.6)
        end

        after :all do
          map_mouseout()
        end

        it "draws the granule's footprint" do
          expect(page).to have_selector('.leaflet-overlay-pane path')
        end
      end

      context "and mousing off of a visualized granule" do
        before :all do
          map_mousemove('#map', 39.1, -96.6)
          map_mouseout()
        end

        it "hides the granule's footprint" do
          expect(page).to have_no_selector('.leaflet-overlay-pane path')
        end
      end
    end

    context "removing a visualized dataset" do
      hook_granule_results_back

      it "hides the dataset's visualizations" do
        expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end
    end
  end

  context "for polygon datasets" do
    before :all do
      create_bounding_box(0, 0, 15, 15)
    end

    use_dataset 'C1000000011-LANCEMODIS', 'MOD02QKM'

    context "visualizing a dataset's granules" do
      hook_granule_results

      it "draws polygons on the map for granule spatial areas" do
        expect(page).to have_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end

      context "and mousing over a visualized granule" do
        before :all do
          map_mousemove()
        end

        after :all do
          map_mouseout()
        end

        it "draws the granule's footprint" do
          expect(page).to have_selector('.leaflet-overlay-pane path', count: 3)
        end
      end

      context "and mousing off of a visualized granule" do
        before :all do
          map_mousemove()
          map_mouseout()
        end

        it "hides the granule's footprint" do
          expect(page).to have_selector('.leaflet-overlay-pane path', count: 1) # Just the spatial constraint
        end
      end
    end

    context "removing a visualized dataset" do
      hook_granule_results_back

      it "hides the dataset's visualizations" do
        expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end
    end
  end

  context "for bounding box datasets" do
    before :all do
      create_bounding_box(0, 0, 15, 15)
    end

    use_dataset 'C204200620-GSFCS4PA', 'AIRS-AMSU variables-CloudSat'

    context "visualizing a dataset's granules" do
      hook_granule_results

      it "draws polygons on the map for granule spatial areas" do
        expect(page).to have_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end

      context "and mousing over a visualized granule" do
        before :all do
          map_mousemove()
        end

        after :all do
          map_mouseout()
        end

        it "draws the granule's footprint" do
          expect(page).to have_selector('.leaflet-overlay-pane path', count: 2)
        end
      end

      context "and mousing off of a visualized granule" do
        before :all do
          map_mousemove()
          map_mouseout()
        end

        it "hides the granule's footprint" do
          expect(page).to have_selector('.leaflet-overlay-pane path', count: 1) # Just the spatial constraint
        end
      end
    end

    context "removing a visualized dataset" do
      hook_granule_results_back

      it "hides the dataset's visualizations" do
        expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end
    end
  end

  context "granule selection", pq: true do
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
      create_bounding_box(0, 0, 15, 15)
    end

    use_dataset 'C1000000011-LANCEMODIS', 'MOD02QKM'
    hook_granule_results

    context "clicking on a granule in the result list" do
      before :all do
        # Click on a bottom one to test re-ordering
        nth_granule_list_item(10).click
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to_not eql 2
        end
      end

      after :all do
        nth_granule_list_item(10).click
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
        end
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

      it "zooms and pans the map to focus on the granule" do
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).not_to eql 2
          expect(page.evaluate_script("$('#map').data('map').map.getCenter().lat")).not_to eql 0
          expect(page.evaluate_script("$('#map').data('map').map.getCenter().lng")).not_to eql 0
        end
      end

      it "displays the granule above all other granules" do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
      end

      context "and clicking on it again" do
        before :all do
          nth_granule_list_item(10).click
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
          end
        end

        after :all do
          nth_granule_list_item(10).click
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to_not eql 2
          end
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

        it "returns the map to its original pan and zoom position" do
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
            expect(page.evaluate_script("$('#map').data('map').map.getCenter().lat")).to eql 0
            expect(page.evaluate_script("$('#map').data('map').map.getCenter().lng")).to eql 0
          end
        end

        it "returns the granule ordering to its original state" do
          expect(page.evaluate_script(is_temporal_ordered_script)).to be_true
        end
      end
    end

    context "clicking on a granule on the map" do
      before :all do
        map_mouseclick
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).not_to eql 2
        end
      end

      after :all do
        map_mouseclick
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
        end
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

      it "zooms and pans the map to focus on the granule" do
        synchronize do
          expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).not_to eql 2
          expect(page.evaluate_script("$('#map').data('map').map.getCenter().lat")).not_to eql 0
          expect(page.evaluate_script("$('#map').data('map').map.getCenter().lng")).not_to eql 0
        end
      end

      it "displays the granule above all other granules" do
        expect(page.evaluate_script(is_temporal_ordered_script)).to be_false
      end

      context "and clicking on it again" do
        before :all do
          map_mouseclick
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
          end
        end

        after :all do
          map_mouseclick
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to_not eql 2
          end
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

        it "returns the map to its original pan and zoom position" do
          synchronize do
            expect(page.evaluate_script("$('#map').data('map').map.getZoom()")).to eql 2
            expect(page.evaluate_script("$('#map').data('map').map.getCenter().lat")).to eql 0
            expect(page.evaluate_script("$('#map').data('map').map.getCenter().lng")).to eql 0
          end
        end

        it "returns the granule ordering to its original state" do
          expect(page.evaluate_script(is_temporal_ordered_script)).to be_true
        end
      end
    end

  end
end
