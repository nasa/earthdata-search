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
      wait_for_xhr
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
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows total number of granules included in the project' do
      first('.collection-card') do
        within '.granule-count' do
          expect(page.text).to match(/\d{1,8} Granules/)
        end
      end
    end

    it 'shows estimated total granule size' do
      first('.collection-card') do
        within '.project-size' do
          expect(page.text).to match(/Estimated Size: \d{1,3}\.\d{1,2} TB/)
        end
      end
    end
  end

  context 'temporal label' do
    context 'when a date range has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['2010-01-01T00:00:00Z', '2014-02-01T00:00:01Z']
        click_link 'My Project'
      end
      it 'shows the start and end dates of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Jan 01, 2010 - Feb 01, 2014')
      end
    end

    context 'when a start date has been selected without an end date' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['2010-01-01T00:00:00Z']
        click_link 'My Project'
      end
      it 'shows only the start of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Jan 01, 2010 - Any end time')
      end
    end

    context 'when an end date has been selected without a start date' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['', '2014-02-01T00:00:01Z']
        click_link 'My Project'
      end
      it 'shows only the end of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Any start time - Feb 01, 2014')
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
      load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit
      login
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 4)
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
      load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit
      create_bounding_box([10, 10], [10, -10], [-10, -10], [-10, 10])
      wait_for_xhr
      login
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons with spatial enabled' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 4)
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
      load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
      wait_for_xhr
      login
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows configuration icons with spatial enabled' do
      within '.collection-capability' do
        expect(page).to have_css('span', count: 4)
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
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows project title' do
      first('.collection-card') do
        expect(page).to have_content('ASTER L1A Reconstructed Unprocessed Instrument Data V003')
      end
    end

    it 'shows total number of granules included in the project' do
      first('.collection-card') do
        within '.granule-count' do
          expect(page.text).to match(/\d{1,8} Granules/)
        end
      end
    end

    it 'shows estimated total granule size' do
      first('.collection-card') do
        within '.project-size' do
          expect(page.text).to match(/Estimated Size: \d{1,3}\.\d{1,2} TB/)
        end
      end
    end

    it 'truncates long project title' do
      within '.collection-card:nth-child(2)' do
        expect(page).to have_content('NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN...')
        expect(page).to have_css("h3[title='NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN, WATER VAPOR OVER OCEAN AND CLOUD LIQUID WATER OVER OCEAN V0']")
      end
    end

    it 'shows details button' do
      within '.collection-card:first-child .action-container' do
        expect(page).to have_content('Details')
      end
    end

    context 'when granules detail modal is opened' do
      before :all do
        within '.collection-card:first-child .action-container' do
          find('a[data-target="#C14758250-LPDAAC_ECS-modal"]').click
        end
      end

      after :all do
        page.evaluate_script("$('#C14758250-LPDAAC_ECS-modal').modal('hide')")
      end

      it 'shows list of in-project granules' do
        within '#C14758250-LPDAAC_ECS-modal' do
          expect(page).to have_css('ul')
        end
      end

      it 'shows browse imagery when available' do
        first('#C14758250-LPDAAC_ECS-modal ul li') do
          expect(page).to have_css('a.panel-list-thumbnail-container')
        end
      end

      it 'shows granule title' do
        first('#C14758250-LPDAAC_ECS-modal ul li') do
          expect(page).to have_content('AST_L1A#[\d_]*.hdf')
        end
      end

      it 'shows granule temporal' do
        first('#C14758250-LPDAAC_ECS-modal ul li') do
          expect(page.text).to match(/Start: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
        end
      end

      # it 'shows a button to exclude the granule from the project' do
      #   within '#C14758250-LPDAAC_ECS-modal ul li:first-child' do
      #     expect(page).to have_link('Remove granule')
      #   end
      # end

      # context 'clicking exclude icon' do
      #   before :all do
      #     within '#C14758250-LPDAAC_ECS-modal ul li:first-child' do
      #       click_link('Remove granule')
      #     end
      #   end

      #   after :all do
      #     within '#C14758250-LPDAAC_ECS-modal ul li:first-child' do
      #       click_link('Undo')
      #     end
      #   end

      #   it 'excludes the granule from the project' do
      #     within '#C14758250-LPDAAC_ECS-modal ul li:first-child' do
      #       expect(page).not_to have_content('AST_L1A#00310302017231617_10312017070847.hdf')
      #     end
      #   end
      # end
    end
  end
end