require "spec_helper"

describe "Collections Collapsed View", reset: false, pq: true do
  extend Helpers::CollectionHelpers

  context 'on the search results screen' do

    before :all do
      Capybara.reset_sessions!
      load_page :search
    end

    it 'shows the expanded collections list by default'

    it 'displays a minimize button for the collections list'

    it 'displays no close button for the collections list'

    context 'clicking the minimize button for the collections list' do
      it 'displays a narrower view of collections'
      it 'displays a map for each collection'
      it 'displays a more info button for each collection'
      it 'displays an add to project button for each collection'
      it 'displays a collection details button for each collection'
      it 'displays a spatial query button for collections with point spatial'
      it 'displays no spatial query button for collections without spatial'
      it 'displays a view collection button for collections with granules'
      it 'displays no view collection button for collections with granules'
      it 'keeps the facet display visible'

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
        context "twice" do
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
