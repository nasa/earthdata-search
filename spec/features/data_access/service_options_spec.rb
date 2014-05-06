require 'spec_helper'

describe 'Service Options', reset: false do
  downloadable_dataset_id = 'C179003030-ORNL_DAAC'
  downloadable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  before :all do
    visit '/search'
    login
    add_dataset_to_project(downloadable_dataset_id, downloadable_dataset_title)

    dataset_results.click_link "View Project"
    click_link "Retrieve project data"
  end

  context "when setting options for a dataset with order options" do
    after :all do
      reset_access_page
    end

    context 'choosing to set an order option' do
      before :all do
        choose 'Ftp_Pull'
      end

      it 'shows the form for the associated order option' do
        expect(page).to have_text('Media Options')
      end

      it 'hides and shows portions of the form based on form selections' do
        expect(page).to have_no_field('Offered Media Format for FTPPULL')
        select 'FTP Pull', from: 'Offered Media Delivery Types'
        expect(page).to have_field('Offered Media Format for FTPPULL')
      end
    end
  end
end
