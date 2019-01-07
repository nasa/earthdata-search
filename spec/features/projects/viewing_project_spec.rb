require 'rails_helper'

describe 'Viewing Single Project' do
  context 'for a saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, authenticate: 'edsc'
      visit_project
      wait_for_xhr
    end

    it 'shows project title' do
      expect(page).to have_css('.editable-text-button-edit')
      expect(page).to have_css('h2', text: 'Test Project')
    end
  end

  context 'for an un-saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :projects_page, project: ['C14758250-LPDAAC_ECS'], authenticate: 'edsc'
    end

    it 'shows default project title' do
      expect(page).to have_css('.editable-text-button-edit')
      expect(page).to have_css('h2', text: 'Untitled Project')
    end
  end

  context 'project summary' do
    before :all do
      Capybara.reset_sessions!
      load_page :projects_page, project: ['C14758250-LPDAAC_ECS'], authenticate: 'edsc'
    end

    it 'shows total number of granules included in the project' do
      find('.project-list-item', match: :first) do
        within '.project-list-item-stat-granules' do
          expect(page.text).to match(/\d{1,8} Granules/)
        end
      end
    end

    it 'shows estimated total granule size' do
      find('.project-list-item', match: :first) do
        within '.project-list-item-stat-size' do
          expect(page.text).to match(/\d{1,3}\.\d{1,2} TB/)
        end
      end
    end
  end

  context 'project configurations' do
    context 'for an EGI collection', pending_updates: true do
      before :all do
        Capybara.reset_sessions!
        load_page :projects_page, project: ['C1000000969-DEV08'], env: :sit, authenticate: 'edsc'
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
          project_list_item = find('.project-list-item', match: :first)

          project_list_item.find('.project-list-item-action-edit-options').click

          click_button('Edit Delivery Method')
          choose('Customize & Download')
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
            project_list_item = find('.project-list-item', match: :first)

            project_list_item.find('.customize').click

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
          project_list_item = find('.project-list-item', match: :first)

          project_list_item.find('.customize').click

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
            project_list_item = find('.project-list-item', match: :first)

            project_list_item.find('.customize').click

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
          project_list_item = find('.project-list-item', match: :first)

          project_list_item.find('.customize').click

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
            project_list_item = find('.project-list-item', match: :first)

            project_list_item.find('.customize').click

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
        load_page :projects_page, project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
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
          load_page :projects_page, project: ['C1200187767-EDF_OPS'], bounding_box: [-10, -10, 10, 10], env: :sit, authenticate: 'edsc'
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
          load_page :projects_page, project: ['C1200187767-EDF_OPS'], polygon: [10, 10, 10, -10, -10, -10, -10, 10, 10, 10], env: :sit, authenticate: 'edsc'
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

  context 'project list item' do
    before :all do
      Capybara.reset_sessions!
      load_page :projects_page, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2'], authenticate: 'edsc'
    end

    it 'shows project title' do
      first('.project-list-item') do
        expect(page).to have_content('ASTER L1A Reconstructed Unprocessed Instrument Data V003')
      end
    end

    it 'shows total number of granules included in the project' do
      first('.project-list-item') do
        within '.project-stats-granule-count' do
          expect(page.text).to match(/\d{1,8} Granules/)
        end
      end
    end

    it 'shows estimated total granule size' do
      first('.project-list-item-stat-size') do
        expect(page.text).to match(/Est. Size: \d{1,3}\.\d{1,2} TB/)
      end
    end

    it 'truncates long project title' do
      within '.project-list-item:nth-child(2)' do
        expect(page).to have_selector('.project-list-item-title', text: /\.{3}$/)
      end
    end

    context 'when granules detail modal is opened' do
      before :all do
        first('.project-list-item').find('.project-list-item-title').click
      end

      # after :all do
      #   page.evaluate_script("$('.project-granules-list-item').modal('hide')")
      # end

      it 'shows list of in-project granules' do
        expect(page).to have_css('.project-granules-list-item')
      end

      it 'shows browse imagery when available' do
        first('.project-granules-list-item') do
          expect(page).to have_css('a.project-granules-list-item-thumb-link')
        end
      end

      it 'shows granule title' do
        find('.project-granules-list-item', match: :first) do
          expect(page).to have_content(/AST_L1A#[\d_]*\.hdf/)
        end
      end

      it 'shows granule temporal' do
        find('.project-granules-list-item', match: :first) do
          expect(page.text).to match(/Start: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
        end
      end

      # it 'shows a button to exclude the granule from the project' do
      #   within '.project-granules-list-item ul li:first-child' do
      #     expect(page).to have_link('Remove granule')
      #   end
      # end

      # context 'clicking exclude icon' do
      #   before :all do
      #     within '.project-granules-list-item ul li:first-child' do
      #       click_link('Remove granule')
      #     end
      #   end

      #   after :all do
      #     within '.project-granules-list-item ul li:first-child' do
      #       click_link('Undo')
      #     end
      #   end

      #   it 'excludes the granule from the project' do
      #     within '.project-granules-list-item ul li:first-child' do
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
      load_page :projects_page, project: ['C14758250-LPDAAC_ECS', 'C1000000000-LANCEAMSR2', 'C179003030-ORNL_DAAC', 'C179001887-SEDAC', 'C1000000220-SEDAC', 'C179001967-SEDAC', 'C179001889-SEDAC', 'C179001707-SEDAC', 'C179002107-SEDAC', 'C179002147-SEDAC', 'C1000000000-SEDAC'], authenticate: 'edsc'
    end

    it 'displays the project summary information' do
      within '.project-stats-collection-count' do
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
