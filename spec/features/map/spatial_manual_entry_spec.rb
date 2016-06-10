require "spec_helper"

describe "Spatial manual entry", reset: false do
  before :all do
    load_page '/search/granules', focus: 'C1219032686-LANCEMODIS'
  end

  let(:spatial_dropdown) do
    page.find('#main-toolbar .spatial-dropdown-button')
  end

  let(:point_button)     { page.find('#map .leaflet-draw-draw-marker') }
  let(:rectangle_button) { page.find('#map .leaflet-draw-draw-rectangle') }

  context "Draw a point on map" do

    before :all do
      create_point(67, -155)
    end

    it 'displays manual entry text box' do
      expect(page).to have_content("Point: -155,67")
    end
  end
end
