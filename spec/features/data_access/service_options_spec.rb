require 'spec_helper'

describe 'Service Options', reset: false do
  downloadable_collection_id = 'C90762182-LAADS'
  downloadable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  collection_with_intermittent_timeline_id = 'C179003030-ORNL_DAAC'

  before :all do
    load_page :search, overlay: false
    login
  end

  context 'for collections with granule results' do
    before :all do
      load_page :search, project: [downloadable_collection_id], view: :project
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context "when setting options for a collection with order options" do
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

  context 'for collections without granule results' do
    before :all do
      load_page :search, project: [collection_with_intermittent_timeline_id], view: :project, temporal: ['2014-07-10T00:00:00Z', '2014-07-10T03:59:59Z']
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    it 'displays no service options' do
      expect(page).to have_no_field('FtpPushPull')
    end

    it 'displays a message indicating that there are no matching granules' do
      expect(page).to have_text('There are no matching granules to access for this collection')
    end
  end

  context "for collections with bounding box prepopulation options" do
    context "when the project's query has a spatial filter" do
      before :all do
        load_page 'data/configure', {project: ['C1000000560-NSIDC_ECS'],
                                     granule_id: 'G1001048061-NSIDC_ECS',
                                     bounding_box: [1, 2, 3, 4]}
      end

      it "prepopulates the options form with the filter's MBR" do
        choose 'AE_SI12.3 ESI Service'
        check 'Enter bounding box'
        expect(page).to have_field('North', with: "3")
        expect(page).to have_field('South', with: "1")
        expect(page).to have_field('East', with: "4")
        expect(page).to have_field('West', with: "2")
      end
    end

    context "when the project's query has no spatial filter" do
      before :all do
        load_page 'data/configure', {project: ['C1000000560-NSIDC_ECS'],
                                     granule_id: 'G1001048061-NSIDC_ECS'}
      end

      it "does not prepopulate the form" do
        choose 'AE_SI12.3 ESI Service'
        check 'Enter bounding box'
        expect(page).to have_field('North', with: "90")
        expect(page).to have_field('South', with: "-90")
        expect(page).to have_field('East', with: "180")
        expect(page).to have_field('West', with: "-180")
      end

    end
  end
end
