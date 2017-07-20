require 'spec_helper'
require 'rake'

describe 'Background jobs ordering', reset: false do
  #pending "FIXME: This is commented out due to abysmally bad orders/hand-edited fixtures. Needs fixes"

  orderable_collection_id = 'C90762182-LAADS'
  orderable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'
  aster_collection_id = 'C14758250-LPDAAC_ECS'

  context "ordering ASTER data" do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, focus: aster_collection_id
      login
      fill_in "granule-ids", with: "AST_L1A#00311092015232127_11102015081255.hdf, AST_L1A#00311092015223445_11102015075930.hdf\t"
      wait_for_xhr

      click_button "Download Data"
      wait_for_xhr

      find("#access-method-C14758250-LPDAAC_ECS-010").click

      click_on 'Continue'
      click_on 'Submit'
      wait_for_xhr

      expect(page).to have_text('Creating')

      expect(Delayed::Worker.new.work_off).to  eq([1, 0])
      load_page "data/retrieve/#{Retrieval.last.to_param}"
    end

    after :all do
      Delayed::Worker.delay_jobs = false
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
      load_page 'data/configure', project: [orderable_collection_id], temporal: ['2016-01-21T00:00:00Z', '2016-01-21T00:00:01Z']
      wait_for_xhr

      choose 'Stage for Delivery'
      select 'FtpPull', from: 'Distribution Options'
      click_on 'Continue'

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
        expect(page).to have_text('Submitting')
      end
    end
  end

  context "when submitting an order that will throw an error" do
    before :all do

      Delayed::Worker.delay_jobs = true

      load_page :search, overlay: false
      login
      load_page 'data/configure', project: [orderable_collection_id], temporal: ['2016-01-21T00:00:00Z', '2016-01-21T00:00:01Z']
      wait_for_xhr

      choose 'Stage for Delivery'
      select 'FtpPull', from: 'Distribution Options'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
      wait_for_xhr
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'initially shows an order in the "Creating" state' do
      expect(page).to have_text('Creating')
    end

    context 'after the order throws an error' do
      before :all do
        begin
          RSpec::Mocks.setup(self)
          allow_any_instance_of(Echo::Client).to receive(:create_order).and_raise("Expected!")
          Delayed::Worker.new.work_off
        ensure
          RSpec::Mocks.teardown()
        end
      end

      it 'shows the order in the "Failed" state without reloading the page' do
        expect(page).to have_no_text('Creating')
        expect(page).to have_text('Failed')
      end

      it 'shows an error code with information on reporting the error' do
        synchronize do
          expect(page).to have_text("To provide us additional details, please click the button below.")
        end
      end
    end
  end
end
