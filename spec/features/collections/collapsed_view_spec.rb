require "spec_helper"

describe "Collections Collapsed View", reset: false, pq: true do
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

      # TODO
      it 'displays a map with spatial for each collection'

      it 'displays a more info button for each collection' do
        expect(first_collapsed_collection).to have_link("More details")
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

      it 'displays a view collection button for collections with granules' do
        for_collapsed_collection  'C179003030-ORNL_DAAC', 'doi:10.3334/ORNLDAAC' do
          expect(first_collapsed_collection).to have_link('Preview collection')
        end
      end

      it 'displays no view collection button for collections without granules' do
        for_collapsed_collection  'C179002107-SEDAC', 'CIESIN_SEDAC_ANTHROMES' do
          expect(first_collapsed_collection).to have_no_link('Preview collection')
        end
      end

      context 'and clicking a collection with granules' do
        it "shows the collection's granule list"
        it "maximizes the overlay"

        context "and returning to the collection list" do
          it "minimizes the overlay"
        end
      end

      context 'and clicking a collection without granules' do
        it "does nothing"
      end

      context "and clicking a collection's more info button" do
        it "displays a flyout with additional collection information"
        it "changes the more info button into a less info button"

        context "followed by its less info button" do
          it "hides the flyout with additional collection information"
          it "changes the less info button into a more info button"
        end
      end

      context "and hovering a collection's add to project button" do
        it "displays help text"
      end

      context "and clicking a collection's add to project button" do
        it "adds the collection to the project"
        it "changes the add to project button to a remove button"
        it "displays a view project button on the collection list"

        context "followed by its remove button" do
          it "removes the collection from the project"
          it "displays an add to project button"
          it "hides the view project button"
        end

        context "clicking on the view project button" do
          it "displays the project"
          it "maximizes the overlay"
        end
      end

      context "and clicking a collection's collection details button" do
        it "displays the collection details"
        it "maximizes the overlay"
      end

      context "and clicking a collection's spatial query button" do
        it "constraint the spatial query to the collection's spatial"
        it "highlights the spatial query button"

        context "twice" do
          it "removes the spatial query constraint"
          it "does not highlight the spatial query button"
        end
      end

      context "and clicking a collection's view collection button" do
        it "displays a hide collection button"
        it "displays the collection's spatial extent on the map"

        context "followed by its hide collection button" do
          it "displays a view collection button"
          it "hides the collection's spatial extent from the map"
        end
      end
    end
  end
end
