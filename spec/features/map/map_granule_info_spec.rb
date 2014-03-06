# EDSC-93: As a user, I want to see an indication of granule counts under my
#          mouse cursor so I may find more information about granules under
#          that point
# EDSC-95: As a user, I want to see basic granule information such as start
#          and end time at a point I select so I may find the most desirable
#          granules at a particular location

require "spec_helper"

describe "Map Granule information", reset: false do
  before :all do
    Capybara.reset_sessions!
    visit "/search"
    first_dataset_result.click_link "Add dataset to the current project"
  end

  after :all do
    reset_project
  end

  context 'when viewing dataset results' do
    #context 'hovering on the map' do
    #  before :all do
    #    map_mousemove()
    #  end

    #  after :all do
    #    map_mouseout()
    #  end

    #  it 'displays no tooltip' do
    #    expect(page).to have_no_content('Granules at this location')
    #  end
    #end

    context 'clicking on the map' do
      before :all do
        map_mouseclick()
      end

      it "displays no popup" do
        expect(page).to have_no_css('.leaflet-popup')
      end
    end
  end

  context 'when viewing a project' do
    before :all do
      dataset_results.click_link "View Project"
      expect(page).to have_css('.panel-list-selected')
    end

    after :all do
      reset_overlay
      expect(page).to have_no_css('.panel-list-selected')
    end

    context 'with a dataset selected' do
      #context 'hovering on the map' do
      #  before :all do
      #    map_mousemove()
      #  end

      #  after :all do
      #    map_mouseout()
      #  end

      #  it 'displays a tooltip containing granule counts under the point' do
      #    expect(page).to have_content('0 Granules at this location')
      #  end

      #  context 'and moving the mouse again' do
      #    before :all do
      #      map_mousemove('#map', 39.1, -96.6, 50, 50)
      #    end

      #    after :all do
      #      map_mousemove()
      #    end

      #    it 'updates the granule count tooltip' do
      #      expect(page).to have_content('39 Granules at this location')
      #    end
      #  end
      #end

      context 'clicking on the map' do
        before :all do
          map_mouseclick()
        end

        after :all do
          find('.leaflet-popup-close-button').click
        end

        it "displays a popup containing granule information" do
          within '.leaflet-popup' do
            expect(page).to have_content('No Granules')
            expect(page).to have_no_selector('.map-popup-pane-item')
          end
        end

        context 'and clicking again elsewhere on the map' do
          before :all do
            map_mouseclick('#map', 39.1, -96.6, 50, 50)
          end

          after :all do
            map_mouseclick()
          end

          it 'displays updated granule information' do
            expect(page).to have_selector('.map-popup-pane-item:not(.busy)', count: 20)
          end
        end
      end

      #context 'hovering on the map toolbar' do
      #  before :all do
      #    map_mousemove('a.leaflet-draw-draw-marker')
      #  end

      #  after :all do
      #    map_mouseout()
      #  end

      #  it 'displays no tooltip' do
      #    expect(page).to have_no_content('Granules at this location')
      #  end
      #end
    end

    context 'with no dataset selected' do
      before :all do
        first_project_dataset.click
      end

      after :all do
        first_project_dataset.click
      end

      #context 'hovering on the map' do
      #  before :all do
      #    map_mousemove()
      #  end

      #  after :all do
      #    map_mouseout()
      #  end

      #  it 'displays no tooltip' do
      #    expect(page).to have_no_content('Granules at this location')
      #  end
      #end

      context 'clicking on the map' do
        before :all do
          map_mouseclick()
        end

        it "displays no popup" do
          expect(page).to have_no_css('.leaflet-popup')
        end
      end
    end
  end
end
