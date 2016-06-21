# Commented out for now.  EDSC-96 is likely OBE but may be re-enabled at some point in the future

# EDSC-96: As a user, I want to see granule browse imagery at a point I select
#          so I may find the most desirable granules at a particular location

#require "spec_helper"
#
#describe "Browse thumbnails", reset: false do
#  before :all do
#    Capybara.reset_sessions!
#    load_page :search
#  end
#
#  context "when viewing the tooltip for a collection whose granules has browse" do
#    before :all do
#      # Has browse
#      add_collection_to_project('C189399410-GSFCS4PA', 'AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005')
#      collection_results.click_link "View Project"
#      map_mouseclick()
#    end
#
#    after :all do
#      reset_overlay
#      reset_project
#    end
#
#    it "displays granule browse imagery" do
#      expect(page).to have_css('img.browse-thumbnail')
#      expect(page).to have_no_content('No browse imagery')
#    end
#  end
#
#  context "when viewing the tooltip for a collection whose granules have no browse" do
#    before :all do
#      add_collection_to_project('C191370861-GSFCS4PA', 'AIRS/Aqua Level 1B Calibration subset V005')
#      collection_results.click_link "View Project"
#      map_mouseclick()
#    end
#
#    after :all do
#      reset_overlay
#      reset_project
#    end
#
#    it 'displays "No browse imagery"' do
#      expect(page).to have_content('No browse imagery')
#      expect(page).to have_no_css('img.browse-thumbnail')
#    end
#  end
#end
