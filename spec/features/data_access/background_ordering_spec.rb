require 'spec_helper'
require 'rake'

describe 'Background jobs ordering', reset: false do
  orderable_collection_id = 'C90762182-LAADS'
  orderable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'
  aster_collection_id = 'C14758250-LPDAAC_ECS'

  context "ordering ASTER data" do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, {project: [aster_collection_id], view: :project}
      login
      first_project_collection.click_link "Show granule filters"
      click_link "Search Multiple"
      fill_in "granule_id_field", with: "AST_L1A#00311092015232127_11102015081255.hdf\nAST_L1A#00311092015223445_11102015075930.hdf"
      click_button "granule-filters-submit"
      wait_for_xhr

      click_link "Retrieve project data"
      wait_for_xhr

      choose "AST_07XT"
      click_on 'Continue'
      click_on 'Submit'
      wait_for_xhr

      expect(page).to have_text('Creating')

      expect(Delayed::Worker.new.work_off).to  eq([1, 0])
      load_page "data/retrieve/#{Retrieval.last.to_param}"
    end
    it "displays dropped granules that don't have the specified access method" do
      expect(page).to have_text('The following granules will not be processed because they do not support the AST_07XT access method')
    end
  end

  context "ordering non-ASTER data" do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, overlay: false
      login
      load_page 'data/configure', project: [orderable_collection_id]
      wait_for_xhr

      choose 'FtpPushPull'
      select 'FtpPull', from: 'Distribution Options'
      click_on 'Continue'

      # wait for modal
      sleep 1
      within '.modal-footer' do
        click_on 'Continue'
      end

      # Confirm address
      click_on 'Submit'
      wait_for_xhr
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'indicates current order status' do
      expect(page).to have_text('Creating')
    end

    context 'after allowing the background job time to process order' do
      before :all do
        expect(Delayed::Worker.new.work_off).to  eq([1, 0])
        load_page "data/retrieve/#{Retrieval.last.to_param}"
      end

      it 'indicates current order status' do
        expect(page).to have_text('Not Validated')
      end
    end
  end
end
