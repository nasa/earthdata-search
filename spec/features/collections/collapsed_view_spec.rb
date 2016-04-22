require "spec_helper"

describe "Collections Collapsed View", reset: false do
  extend Helpers::CollectionHelpers

  context 'on the search results screen' do

    before :all do
      Capybara.reset_sessions!
      load_page :search
    end

    it 'shows the expanded collections list by default' do
      width = page.evaluate_script('$("#collection-results").width()')
      expect(width).to be > 350
      expect(page).to have_css('.is-master-overlay-maximized')
      expect(collection_results).to have_no_css('.ccol')
    end

    it 'displays a minimize button for the collections list' do
      expect(page).to have_link('Minimize')
    end

    it 'displays no close button for the collections list' do
      expect(collection_results).to have_no_css('.master-overlay-close')
    end

    context 'clicking the minimize button for the collections list' do
      before :all do
        click_link 'Minimize'
      end

      it 'displays a narrower view of collections' do
        width = page.evaluate_script('$("#collection-results").width()')
        expect(width).to be < 350
        expect(collection_results).to have_css('.ccols')
      end

      it 'displays a map with spatial for each collection' do
        expect(first_collapsed_collection).to have_css('.ccol-mini-map-spatial-layer', visible: true)
      end

      it 'displays a more info button for each collection' do
        expect(first_collapsed_collection).to have_link("Toggle details")
      end

      it 'displays an add to project button for each collection' do
        expect(first_collapsed_collection).to have_css("a.add-to-project")
      end

      it 'displays a collection details button for each collection' do
        expect(first_collapsed_collection).to have_link("View collection details")
      end

      it 'displays a spatial query button for collections with point spatial' do
        for_collapsed_collection  'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC' do
          expect(first_collapsed_collection).to have_link("Search using this collection's location")
        end
      end

      it 'displays no spatial query button for collections without spatial' do
        for_collapsed_collection 'C14758250-LPDAAC_ECS', 'AST_L1A' do
          expect(first_collapsed_collection).to have_no_link("Search using this collection's location")
        end
      end

      it 'displays no view collection button for collections with granules' do
        for_collapsed_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC' do
          expect(first_collapsed_collection).to have_no_link('Preview collection')
        end
      end

      it 'displays no view collection button for collections without granules' do
        for_collapsed_collection  'C179002107-SEDAC', 'CIESIN_SEDAC_ANTHROMES' do
          expect(first_collapsed_collection).to have_no_link('Preview collection')
        end
      end

      context 'and viewing a collection without version_id' do
        use_collection 'C1214605943-SCIOPS', 'CANEMRCCRSBAPMN'

        it "doesn't show version id" do
          expect(page).to have_content('CANEMRCCRSBAPMN')
          expect(page).to have_no_content('CANEMRCCRSBAPMN - Not provided')
        end
      end

      context 'and clicking a collection with granules' do
        use_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC'

        before :all do
          view_granule_results
        end

        it "shows the collection's granule list" do
          expect(page).to have_visible_granule_list
        end

        it "maximizes the overlay" do
          expect(page).to have_css('.is-master-overlay-maximized')
        end

        context "and returning to the collection list" do
          before :all do
            leave_granule_results
          end

          it "minimizes the overlay" do
            expect(page).to have_css('.is-master-overlay-minimized')
          end
        end
      end

      context 'and clicking a collection without granules' do
        use_collection  'C179002107-SEDAC', 'CIESIN_SEDAC_ANTHROMES'

        before :all do
          page.execute_script("$('#collection-results .ccol:first-child').click()")
          wait_for_xhr
        end

        it "does nothing" do
          expect(page).to have_visible_collection_results
        end
      end

      context "and clicking a collection's more info button" do
        use_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC'

        before :all do
          first_collapsed_collection.click_link('Toggle details')
        end

        it "displays a flyout with additional collection information" do
          expect(page).to have_selector('.flyout')
          expect(page.find('.flyout')).to have_text('Archive Center')
        end

        it "changes the more info button into a less info button" do
          expect(page).to have_selector('.fa-chevron-circle-left')
          expect(page).to have_no_selector('.fa-chevron-circle-right')
        end

        context "followed by its less info button" do
          before :all do
            first_collapsed_collection.click_link('Toggle details')
          end

          it "hides the flyout with additional collection information" do
            expect(page).to have_no_selector('.flyout')
          end

          it "changes the less info button into a more info button" do
            expect(page).to have_selector('.fa-chevron-circle-right', visible: true)
            expect(page).to have_no_selector('.fa-chevron-circle-left', visible: true)
          end
        end
      end

      context "and hovering a collection's add to project button" do
        before :all do
          first_collapsed_collection.find('a.add-to-project').trigger(:mouseover)
          wait_for_xhr
        end

        it "displays help text" do
          expect(page.find('.flyout')).to have_text('Add collections to your project')
        end

        context "followed by un-hovering the add to project button" do
          before :all do
            first_collapsed_collection.find('a.add-to-project').trigger(:mouseout)
            wait_for_xhr
          end

          it "hides the help text" do
            expect(page).to have_no_text('Add collections to your project')
          end
        end
      end

      context "and clicking a collection's add to project button" do
        use_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC'

        before :all do
          first_collapsed_collection.find('a.add-to-project').click
          wait_for_xhr
        end

        after :all do
          first_collapsed_collection.click_link 'Remove collection from the current project'
          wait_for_xhr
        end

        it "adds the collection to the project" do
          expect(project_collection_ids).to match_array(['15 Minute Stream Flow Data: USGS (FIFE)'])
        end

        it "changes the add to project button to a remove button" do
          expect(first_collapsed_collection).to have_no_css("a.add-to-project")
          expect(first_collapsed_collection).to have_link('Remove collection from the current project')
        end

        it "displays a view project button on the collection list" do
          expect(collection_results).to have_link('View Project')
        end

        it "hides the add to project help text" do
          expect(page).to have_no_text('Add collections to your project')
        end

        context "followed by its remove button" do
          before :all do
            first_collapsed_collection.click_link 'Remove collection from the current project'
            wait_for_xhr
          end

          after :all do
            first_collapsed_collection.find('a.add-to-project').click
            wait_for_xhr
          end

          it "removes the collection from the project" do
            expect(project_collection_ids).to match_array([])
          end

          it "displays an add to project button" do
            expect(first_collapsed_collection).to have_css("a.add-to-project")
          end

          it "hides the view project button" do
            expect(collection_results).to have_no_link('View Project')
          end
        end

        context "clicking on the view project button" do
          before :all do
            collection_results.click_link "View Project"
            wait_for_xhr
          end

          after :all do
            project_overview.click_link "Back to Collection Search"
            wait_for_xhr
          end

          it "displays the project" do
            expect(page).to have_visible_project_overview
          end

          it "maximizes the overlay" do
            expect(page).to have_css('.is-master-overlay-maximized')
          end
        end
      end

      context "and clicking a collection's collection details button" do
        use_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC'

        before :all do
          first_collapsed_collection.click_link "View collection details"
          wait_for_xhr
        end

        after :all do
          collection_details.click_link "Back to Collections"
          wait_for_xhr
        end

        it "displays the collection details" do
          expect(page).to have_visible_collection_details
        end

        it "maximizes the overlay" do
          expect(page).to have_css('.is-master-overlay-maximized')
        end
      end

      context "and clicking a collection's spatial query button" do
        use_collection 'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC'

        before :all do
          first_collapsed_collection.click_link "Search using this collection's location"
          wait_for_xhr
        end

        it "constrains the spatial query to the collection's spatial" do
          expect(page).to have_css('#map .leaflet-marker-icon')
        end

        it "highlights the spatial query button" do
          expect(first_collapsed_collection).to have_css('a.button-active .fa-map-marker')
        end

        context "twice" do
          before :all do
            first_collapsed_collection.click_link "Search using this collection's location"
            wait_for_xhr
          end

          it "removes the spatial query constraint" do
            expect(page).to have_no_css('#map .leaflet-marker-icon')
          end

          it "does not highlight the spatial query button" do
            expect(first_collapsed_collection).to have_no_css('a.button-active .fa-map-marker')
          end
        end
      end
    end
  end
end
