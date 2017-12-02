require 'spec_helper'

describe "Viewing Single Project", reset: false do

  context 'for a saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search
      login
      visit_project
      wait_for_xhr
    end

    it 'shows project title' do
      expect(page).to have_css('.save-icon')
      expect(page).to have_css('h2', text: 'Test Project')
    end
  end

  context 'for an un-saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS']
      login
      click_link 'My Project'
    end

    it 'shows default project title' do
      expect(page).to have_css('h2', text: 'Untitled Project')
      expect(page).to have_css('.save-icon')
    end
  end

  context 'project summary' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS']
      login
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows total in-project collections, granules, and size' do
      expect(page).to have_content('2813384 Granules 1 Collection 269.8 TB')
    end
  end

  context 'temporal label' do
    context 'when a date range has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2']
        login
        click_link "Temporal"
        fill_in "Start", with: "2010-01-01 00:00:00\t\t"
        fill_in "End", with: "2014-02-01 00:00:00\t\t"
        js_click_apply ".temporal-dropdown"
        Capybara::Screenshot.screenshot_and_save_page
        click_link 'My Project'
      end
      it 'shows the start and end dates of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Jan 01, 2010 - Feb 01, 2014')
      end
    end
  end
  
  context 'minimap' do
    context 'when a polygon has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2']
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr
        login
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css(".leaflet-map-pane")
      end

      it 'shows a label stating that a polygon is used' do
        expect(find('.project-details')).to have_content('Polygon')
      end

      it 'draws the polygon spatial constraint on the map' do
        expect(page).to have_selector('#bounding-box-map path', count: 2)
      end
    end

    context 'when a rectangle has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2']
        create_bounding_box([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr
        login
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css(".leaflet-map-pane")
      end

      it 'shows a label stating that a rectangle is used' do
        expect(find('.project-details')).to have_content('Rectangle')
      end

      it 'draws the rectangle spatial constraint on the map' do
        expect(page).to have_selector('#bounding-box-map path', count: 1)
      end
    end

    context 'when a point has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2']
        create_point(0, 0)
        wait_for_xhr
        login
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css(".leaflet-map-pane")
      end

      it 'shows a label stating that a point is used' do
        expect(find('.project-details')).to have_content('Point')
      end

      it "places a point spatial constraint on the map" do
        expect(page).to have_css('#bounding-box-map .leaflet-marker-icon')
      end
    end
  end

  context 'project configurations' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C1000000968-DEV08'], env: :sit
      login
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 3)
        expect(page).to have_css('span.enabled', count: 0)

        expect(page).to have_css('i.fa.fa-globe')
        expect(page).to have_css('i.fa.fa-sliders')
        expect(page).to have_css('i.fa.fa-file-text-o')
      end
    end
  end

  context 'project configurations with spatial subsetting enabled via bounding box' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C1000000968-DEV08'], env: :sit, bounding_box: [0, 0, 2, 2]
      wait_for_xhr
      login
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons with spatial enabled' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 3)
        expect(page).to have_css('span.enabled', count: 1)

        within 'span.enabled' do
          expect(page).to have_css('i.fa.fa-globe')
        end
        expect(page).to have_css('i.fa.fa-sliders')
        expect(page).to have_css('i.fa.fa-file-text-o')
      end
    end
  end

  context 'project configurations with spatial subsetting enabled via polygon' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C1000000968-DEV08'], env: :sit, polygon: [20, 102, 40, 103, 60, 104, 80, 105]
      wait_for_xhr
      login
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons with spatial enabled' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 3)
        expect(page).to have_css('span.enabled', count: 1)

        within 'span.enabled' do
          expect(page).to have_css('i.fa.fa-globe')
        end
        expect(page).to have_css('i.fa.fa-sliders')
        expect(page).to have_css('i.fa.fa-file-text-o')
      end
    end
  end

  context 'project card' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2']
      login
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows project title' do
      within '.collection-card:first-child' do
        expect(page).to have_content('ASTER L1A Reconstructed Unprocessed Instrument Data V003')
      end
    end

    it 'shows total number of granules included in the project' do
      within '.collection-card:first-child' do
        expect(page).to have_content('2813384 Granules')
      end
    end

    it 'shows estimated total granule size' do
      within '.collection-card:first-child' do
        expect(page).to have_content('Estimated Size: 269.8 TB')
      end
    end

    it 'truncates long project title' do
      within '.collection-card:nth-child(2)' do
        expect(page).to have_content('NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN...')
        expect(page).to have_css("h3[title='NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN, WATER VAPOR OVER OCEAN AND CLOUD LIQUID WATER OVER OCEAN V0']")
      end
    end
  end
end
