require "spec_helper"

describe "CWIC-enabled granule results", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, q: 'C1220566654-USGS_LTA'
  end

  context "for CWIC-tagged collections" do
    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    context "performing a temporal search" do
      context "and setting a non-recurring temporal condition" do
        before(:all) { set_temporal("2013-12-01 00:00:00", "2013-12-01 23:59:59") }

        it "filters the results list to matching granules", acceptance: true do
          expect(first_granule_list_item).to have_text('2013-12-01')
          expect(page).to have_text('Showing 20 of 30 matching granules')
        end

        it "does not display a warning" do
          expect(page).to have_no_popover
        end

        context "and removing the temporal condition" do
          before(:all) { unset_temporal }
          after(:all) { set_temporal("2013-12-01 00:00:00", "2013-12-01 23:59:59") }

          it "updates the results list with the new filter", acceptance: true do
            expect(first_granule_list_item).to have_no_text('2013-12-01')
            expect(page).to have_no_text('Showing 20 of 30 matching granules')
            expect(page).to have_text('Showing 20 of')
          end
        end

        context "and setting a recurring temporal condition" do
          before(:all) { set_temporal("12-01 00:00:00", "12-01 23:59:59", [2013, 2014]) }
          after(:all) { set_temporal("2013-12-01 00:00:00", "2013-12-01 23:59:59") }

          it "displays a warning that recurring temporal is not supported" do
            expect(page).to have_popover('Recurring Temporal Unavailable')
          end
        end
      end

      context "and setting a recurring temporal condition" do
        before(:all) { set_temporal("12-01 00:00:00", "12-01 23:59:59", [2013, 2014]) }

        it "filters the results list to the period from the first recurring start to the last recurring end", acceptance: true do
          expect(first_granule_list_item).to have_text('2014-12-01')
          expect(page).to have_text('Showing 20 of 6068 matching granules')
        end

        it "displays a warning that recurring temporal is not supported", acceptance: true do
          expect(page).to have_popover('Recurring Temporal Unavailable')
        end

        context "and removing the recurring temporal condition" do
          before(:all) { unset_temporal }
          after(:all) { set_temporal("12-01 00:00:00", "12-01 23:59:59", [2013, 2014]) }

          it "removes the warning that recurring temporal is not supported" do
            expect(page).to have_no_popover
          end
        end

        context "and setting a non-recurring granule-specific filter" do
          before(:all) { set_temporal("2013-12-01 00:00:00", "2013-12-01 23:59:59", nil, :focus) }
          after(:all) { unset_temporal(:focus) }

          it "removes the warning that recurring temporal is not supported" do
            expect(page).to have_no_popover
          end
        end

        context "and returing to the results list" do
          before(:all) { leave_granule_results }
          after(:all) { view_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data") }

          it "removes the warning that recurring temporal is not supported" do
            expect(page).to have_no_popover
          end
        end

        context "and setting a non-recurring temporal condition" do
          before(:all) { set_temporal("2013-12-01 00:00:00", "2013-12-01 23:59:59") }
          after(:all) { set_temporal("12-01 00:00:00", "12-01 23:59:59", [2013, 2014]) }

          it "removes the warning that recurring temporal is not supported" do
            expect(page).to have_no_popover
          end
        end
      end
    end

  end
end
