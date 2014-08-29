require 'spec_helper'

describe "User missing ordering preferences", reset: false do
  dataset_id = 'C179003030-ORNL_DAAC'
  dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  context "when configuring a data access request" do
    before :all do
      load_page :search, project: [dataset_id], view: :project
      wait_for_xhr

      login 'edscbasic'

      click_link "Retrieve project data"

      choose "Ftp_Pull"
      select 'FTP Pull', from: 'Offered Media Delivery Types'
      select 'Tape Archive Format (TAR)', from: 'Offered Media Format for FTPPULL'
      click_button "Continue"
    end

    it "does not show an error message" do
      expect(page).to have_no_content('Contact information could not be loaded, please try again later')
    end
  end

end
