require 'spec_helper'

describe 'Viewing Single Project' do
  context 'for a saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, authenticate: 'edsc'
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
      load_page :search, project: ['C14758250-LPDAAC_ECS'], authenticate: 'edsc'
      wait_for_xhr
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows default project title' do
      expect(page).to have_css('h2', text: 'Untitled Project')
      expect(page).to have_css('.save-icon')
    end
  end

  context 'project summary' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS'], authenticate: 'edsc'
      click_link 'My Project'
      wait_for_xhr
    end

    it 'shows total number of granules included in the project' do
      find('.collection-card', match: :first) do
        within '.granule-count' do
          expect(page.text).to match(/\d{1,8} Granules/)
        end
      end
    end

    it 'shows estimated total granule size' do
      find('.collection-card', match: :first) do
        within '.project-size' do
          expect(page.text).to match(/\d{1,3}\.\d{1,2} TB/)
        end
      end
    end
  end

  context 'temporal label' do
    context 'when a date range has been selected' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['2010-01-01T00:00:00Z', '2014-02-01T00:00:01Z'], authenticate: 'edsc'
        wait_for_xhr
        click_link 'My Project'
        wait_for_xhr
      end
      it 'shows the start and end dates of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Jan 01, 2010 - Feb 01, 2014')
      end
    end

    context 'when a start date has been selected without an end date' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['2010-01-01T00:00:00Z'], authenticate: 'edsc'
        wait_for_xhr
        click_link 'My Project'
      end
      it 'shows only the start of that range within the temporal label' do
        expect(find('#temporal-label')).to have_content('Jan 01, 2010 - Any end time')
      end
    end

    context 'when an end date has been selected without a start date' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], temporal: ['', '2014-02-01T00:00:01Z'], authenticate: 'edsc'
        wait_for_xhr
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
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], authenticate: 'edsc'
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css('.leaflet-map-pane')
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
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], authenticate: 'edsc'
        create_bounding_box(-10, -10, 10, 10)
        wait_for_xhr
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css('.leaflet-map-pane')
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
        load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], authenticate: 'edsc'
        create_point(0, 0)
        wait_for_xhr
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows a map of the designated area' do
        expect(find_by_id('bounding-box-map')).to have_css('.leaflet-map-pane')
      end

      it 'shows a label stating that a point is used' do
        expect(find('.project-details')).to have_content('Point')
      end

      it 'places a point spatial constraint on the map' do
        expect(page).to have_css('#bounding-box-map .leaflet-marker-icon')
      end
    end
  end

  context 'project configurations' do
    context 'for an EGI collection', pending_updates: true do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C1000000969-DEV08'], env: :sit, authenticate: 'edsc'
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows configuration icons' do
        within '.collection-capability' do
          expect(page).to have_css('span', count: 4)
          expect(page).to have_css('span.enabled', count: 0)

          expect(page).to have_css('i.fa.fa-globe')
          expect(page).to have_css('i.fa.fa-tags')
          expect(page).to have_css('i.fa.fa-sliders')
          expect(page).to have_css('i.fa.fa-file-text-o')
        end
      end

      # NOTE: ESI provides a default value for 'parameters' which results in the variable
      # subsetting being enabled when any of the other subsetting values are enabled.
      context 'project configurations with spatial subsetting enabled via bounding box' do
        before :all do
          collection_card = find('.collection-card', match: :first)

          collection_card.find('.customize').click

          check 'Enter bounding box'

          within '.modal-footer' do
            click_button 'Done'
          end
        end

        it 'shows configuration icons with spatial enabled' do
          within '.collection-capability' do
            expect(page).to have_css('span', count: 4)
            # ECHO forms defaults the value for the variables to 'ALL' so unless the
            # user unchecks these values they will be saved when the form is saved
            # for the first time.
            expect(page).to have_css('span.enabled', count: 2)

            expect(page).to have_css('span.enabled i.fa.fa-globe')
            expect(page).to have_css('span.enabled i.fa.fa-tags')

            expect(page).to have_css('i.fa.fa-sliders')
            expect(page).to have_css('i.fa.fa-file-text-o')
          end
        end

        context 'when spatial subsetting is disabled' do
          before :all do
            collection_card = find('.collection-card', match: :first)

            collection_card.find('.customize').click

            uncheck 'Enter bounding box'

            within '.modal-footer' do
              click_button 'Done'
            end
          end

          it 'shows configuration icons with spatial disabled' do
            within '.collection-capability' do
              expect(page).to have_css('span', count: 4)
              # ECHO forms defaults the value for the variables to 'ALL' so unless the
              # user unchecks these values they will be saved when the form is saved
              # for the first time.
              expect(page).to have_css('span.enabled', count: 1)

              expect(page).to have_css('span.enabled i.fa.fa-tags')

              expect(page).to have_css('i.fa.fa-globe')
              expect(page).to have_css('i.fa.fa-sliders')
              expect(page).to have_css('i.fa.fa-file-text-o')
            end
          end
        end
      end

      context 'project configurations with reformatting enabled' do
        before :all do
          collection_card = find('.collection-card', match: :first)

          collection_card.find('.customize').click

          within '#HEG-formatselect-element' do
            find("option[value='GeoTIFF']").select_option
          end

          within '.modal-footer' do
            click_button 'Done'
          end
        end

        it 'shows configuration icons with reformatting enabled' do
          within '.collection-capability' do
            expect(page).to have_css('span', count: 4)
            # ECHO forms defaults the value for the variables to 'ALL' so unless the
            # user unchecks these values they will be saved when the form is saved
            # for the first time.
            expect(page).to have_css('span.enabled', count: 2)

            expect(page).to have_css('span.enabled i.fa.fa-tags')
            expect(page).to have_css('span.enabled i.fa.fa-file-text-o')

            expect(page).to have_css('i.fa.fa-globe')
            expect(page).to have_css('i.fa.fa-sliders')
          end
        end

        context 'when reformatting is disabled' do
          before :all do
            collection_card = find('.collection-card', match: :first)

            collection_card.find('.customize').click

            within '#HEG-formatselect-element' do
              find("option[value='']").select_option
            end

            within '.modal-footer' do
              click_button 'Done'
            end
          end

          it 'shows configuration icons with reformatting disabled' do
            within '.collection-capability' do
              expect(page).to have_css('span', count: 4)
              # ECHO forms defaults the value for the variables to 'ALL' so unless the
              # user unchecks these values they will be saved when the form is saved
              # for the first time.
              expect(page).to have_css('span.enabled', count: 1)

              expect(page).to have_css('span.enabled i.fa.fa-tags')

              expect(page).to have_css('i.fa.fa-globe')
              expect(page).to have_css('i.fa.fa-sliders')
              expect(page).to have_css('i.fa.fa-file-text-o')
            end
          end
        end
      end

      context 'project configurations with transformations enabled' do
        before :all do
          collection_card = find('.collection-card', match: :first)

          collection_card.find('.customize').click

          within '#HEG-projectselect-element' do
            find("option[value='LAMBERT AZIMUTHAL']").select_option
          end

          within '.modal-footer' do
            click_button 'Done'
          end
        end

        it 'shows configuration icons with transformations enabled' do
          within '.collection-capability' do
            expect(page).to have_css('span', count: 4)
            # ECHO forms defaults the value for the variables to 'ALL' so unless the
            # user unchecks these values they will be saved when the form is saved
            # for the first time.
            expect(page).to have_css('span.enabled', count: 2)

            expect(page).to have_css('span.enabled i.fa.fa-tags')
            expect(page).to have_css('span.enabled i.fa.fa-sliders')

            expect(page).to have_css('i.fa.fa-globe')
            expect(page).to have_css('i.fa.fa-file-text-o')
          end
        end

        context 'when transofmrations is disabled' do
          before :all do
            collection_card = find('.collection-card', match: :first)

            collection_card.find('.customize').click

            within '#HEG-projectselect-element' do
              find("option[value='&']").select_option
            end

            within '.modal-footer' do
              click_button 'Done'
            end
          end

          it 'shows configuration icons with transofmrations disabled' do
            within '.collection-capability' do
              expect(page).to have_css('span', count: 4)
              # ECHO forms defaults the value for the variables to 'ALL' so unless the
              # user unchecks these values they will be saved when the form is saved
              # for the first time.
              expect(page).to have_css('span.enabled', count: 1)

              expect(page).to have_css('span.enabled i.fa.fa-tags')

              expect(page).to have_css('i.fa.fa-globe')
              expect(page).to have_css('i.fa.fa-sliders')
              expect(page).to have_css('i.fa.fa-file-text-o')
            end
          end
        end
      end
    end

    context 'for an OPeNDAP collection' do
      before :all do
        Capybara.reset_sessions!
        load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
        wait_for_xhr
        click_link 'My Project'
        wait_for_xhr
      end

      it 'shows configuration icons' do
        within '.collection-capability' do
          expect(page).to have_css('span', count: 4)
          expect(page).to have_css('span.enabled', count: 0)

          expect(page).to have_css('i.fa.fa-globe')
          expect(page).to have_css('i.fa.fa-tags')
          expect(page).to have_css('i.fa.fa-sliders')
          expect(page).to have_css('i.fa.fa-file-text-o')
        end
      end

      context 'project configurations with spatial subsetting enabled via bounding box' do
        before :all do
          Capybara.reset_sessions!
          load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
          create_bounding_box(-10, -10, 10, 10)
          wait_for_xhr
          click_link 'My Project'
          wait_for_xhr
        end

        it 'shows configuration icons with spatial enabled' do
          within '.collection-capability' do
            expect(page).to have_css('span', count: 4)
            expect(page).to have_css('span.enabled', count: 1)

            expect(page).to have_css('span.enabled i.fa.fa-globe')

            expect(page).to have_css('i.fa.fa-tags')
            expect(page).to have_css('i.fa.fa-sliders')
            expect(page).to have_css('i.fa.fa-file-text-o')
          end
        end
      end

      context 'project configurations with spatial subsetting enabled via polygon' do
        before :all do
          Capybara.reset_sessions!
          load_page :search, project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
          create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
          wait_for_xhr
          click_link 'My Project'
          wait_for_xhr
        end

        it 'shows configuration icons with spatial enabled' do
          within '.collection-capability' do
            expect(page).to have_css('span', count: 4)
            expect(page).to have_css('span.enabled', count: 1)

            expect(page).to have_css('span.enabled i.fa.fa-globe')

            expect(page).to have_css('i.fa.fa-tags')
            expect(page).to have_css('i.fa.fa-sliders')
            expect(page).to have_css('i.fa.fa-file-text-o')
          end
        end
      end
    end
  end

  context 'project card' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], authenticate: 'edsc'
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
        expect(page.text).to match(/Estimated Size: \d{1,3}\.\d{1,2} TB/)
      end
    end

    it 'truncates long project title' do
      within '.collection-card:nth-child(2)' do
        expect(page).to have_content('NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN...')
        expect(page).to have_css("h3[title='NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN, WATER VAPOR OVER OCEAN AND CLOUD LIQUID WATER OVER OCEAN V0']")
      end
    end

    it 'shows view granules link' do
      within '.collection-card:first-child .collection-extra .label-secondary' do
        expect(page).to have_content('View Granules')
      end
    end

    context 'when granules detail modal is opened' do
      before :all do
        within '.collection-card:first-child .collection-card-content' do
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
        find('#C14758250-LPDAAC_ECS-modal ul li', match: :first) do
          expect(page).to have_content(/AST_L1A#[\d_]*\.hdf/)
        end
      end

      it 'shows granule temporal' do
        find('#C14758250-LPDAAC_ECS-modal ul li', match: :first) do
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

  context 'when the project has more than 10 collections' do
    # If you are re-recording cassettes, this test will probably need multiple runs
    # due to the number of requests for 11 collections on the project page
    # `could not obtain a database connection within 5.000 seconds` shows up until
    # all cassettes are recorded
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2', 'C179003030-ORNL_DAAC', 'C179001887-SEDAC', 'C1000000220-SEDAC', 'C179001967-SEDAC', 'C179001889-SEDAC', 'C179001707-SEDAC', 'C179002107-SEDAC', 'C179002147-SEDAC', 'C1000000000-SEDAC'], authenticate: 'edsc'
      click_link 'My Project'
      wait_for_xhr
    end

    it 'displays the project summary information' do
      within '.project-panel .collection-count' do
        expect(page).to have_content('11 Collections')
      end
    end

    it 'displays collection information for all collections', data_specific: true do
      within '.project-collection-cards' do
        expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
        expect(page).to have_content('2001 Environmental Sustainability Index (ESI)')
        expect(page).to have_content('ASTER L1A Reconstructed Unprocessed Instrument Data V003')
        expect(page).to have_content('NRT AMSR2 L2B GLOBAL SWATH GSFC PROFILING ALGORITHM 2010: SURFACE PRECIPITATION, WIND SPEED OVER OCEAN')
        expect(page).to have_content('2002 Environmental Sustainability Index (ESI)')
        expect(page).to have_content('2005 Environmental Sustainability Index (ESI)')
        expect(page).to have_content('2008 Environmental Performance Index (EPI)')
        expect(page).to have_content('Anthropogenic Biomes of the World, Version 1')
        expect(page).to have_content('2010 Environmental Performance Index (EPI)')
        expect(page).to have_content('2012 Environmental Performance Index and Pilot Trend Environmental Performance Index')
        expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
      end
    end
  end
end
