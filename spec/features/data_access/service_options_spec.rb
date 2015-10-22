require 'spec_helper'

describe 'Service Options', reset: false do
  downloadable_dataset_id = 'C90762182-LAADS'
  downloadable_dataset_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  dataset_with_intermittent_timeline_id = 'C179003030-ORNL_DAAC'

  before :all do
    load_page :search, overlay: false
    login
  end

  context 'for datasets with granule results' do
    before :all do
      load_page :search, project: [downloadable_dataset_id], view: :project
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context "when setting options for a dataset with order options" do
      after :all do
        reset_access_page
      end

      context 'choosing to set an order option' do
        before :all do
          choose 'FtpPushPull'
        end

        it 'shows the form for the associated order option' do
          expect(page).to have_text('Distribution Options')
        end

        it 'hides and shows portions of the form based on form selections' do
          expect(page).to have_no_text('Ftp Push Information')
          select 'FtpPush', from: 'Distribution Options'
          expect(page).to have_text('Ftp Push Information')
        end
      end
    end
  end

  context 'for datasets without granule results' do
    before :all do
      load_page :search, project: [dataset_with_intermittent_timeline_id], view: :project, temporal: ['2014-07-10T00:00:00Z', '2014-07-10T03:59:59Z']
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    it 'displays no service options' do
      expect(page).to have_no_field('FtpPushPull')
    end

    it 'displays a message indicating that there are no matching granules' do
      expect(page).to have_text('There are no matching granules to access for this dataset')
    end
  end
end
