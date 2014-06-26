require 'spec_helper'

describe "User missing ordering preferences", reset: false do
  dataset_id = 'C179003030-ORNL_DAAC'
  dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  context "when submitting a data access request" do
    before :all do
      load_page :search, project: [dataset_id], view: :project
      click_link "Retrieve project data"

      fill_in 'Username', with: 'edscbasic'
      fill_in 'Password', with: 'EDSCtest!1'
      click_button 'Sign In'
      wait_for_xhr

      choose "Ftp_Pull"
      select 'FTP Pull', from: 'Offered Media Delivery Types'
      select 'Tape Archive Format (TAR)', from: 'Offered Media Format for FTPPULL'
      click_button "Continue"

      fill_in "First name", with: "EDSC"
      fill_in "Last name", with: "Basic Account"
      fill_in "Email", with: "patrick+edscbasic@element84.com"
      fill_in "Street", with: "101 North Columbus St."
      fill_in "City", with: "Alexandria"
      select "United States", from: "Country"
      select "VA", from: "State"
      fill_in "Zip", with: "22314"
      fill_in "Phone number", with: "555-555-5555"
      click_button "Submit"
#       wait_for_xhr
#       sleep 15
# Capybara.screenshot_and_open_image
    end

    it "creates an order successfully" do
      expect(page).to have_content('The following datasets are being processed')
      expect(page).to have_content(dataset_title)
    end
  end

end
