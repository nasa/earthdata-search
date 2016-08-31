require "spec_helper"

describe "Spatial and temporal extraction", reset: false do

  context "extracted spatial information" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'Texas'
    end

    after :all do
      load_page :search
    end

    it "filters collection results" do
      expect(page).to have_content('8013 Matching Collections')
    end

    it "is set in the query" do
      project_id = URI.parse(current_url).query[/^projectId=(\d+)$/, 1].to_i
      expect(Project.find(project_id).path).to eql('m=31.168933999999993!-100.0768425!5!1!0!0%2C2&ok=Texas&sb=-106.645646%2C25.837163999999998%2C-93.508039%2C36.500704')
    end

    it "is set on the map" do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_spatial_constraint('bounding_box:-106.645646,25.837163999999998:-93.508039,36.500704')
    end
  end
end