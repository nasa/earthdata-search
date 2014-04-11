# EDSC-189: As a user, I want to choose which day is displayed for my displayed
#           granules so I may view results across multiple days

require "spec_helper"

describe "Timeline date selection", reset: false do
  extend Helpers::DatasetHelpers

  start_1987 = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  start_1988 = DateTime.new(1988, 1, 1, 0, 0, 0, '+0')
  start_1989 = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')
  start_feb_1989 = DateTime.new(1989, 2, 1, 0, 0, 0, '+0')
  start_mar_1989 = DateTime.new(1989, 3, 1, 0, 0, 0, '+0')

  before :all do
    visit '/search'
  end

  use_dataset('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
  hook_granule_results

  before :all do
    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    zoom_out_button.click
    pan_timeline(-20.years)
    wait_for_xhr
    expect(granule_list).to have_text('Showing 20 of 39 matching granules')
  end

  context "clicking on a time span in the time line" do
    before(:all) { click_timeline_date('1987') }

    it "highlights the selected time span" do
      expect(page).to have_focused_time_span(start_1987, start_1988)
    end

    it "shows only granules within that time span" do
      expect(granule_list).to have_text('Showing 13 of 13 matching granules')
    end


    it "indicates that not all granule results are being shown" do
      expect(granule_list).to have_text('for the selected year')
    end

    it "provides a link to show all granules" do
      expect(granule_list).to have_link('Show All')
    end

    context "twice" do
      before(:all) { click_timeline_date('1987') }
      after(:all) { click_timeline_date('1987') }

      it "removes the time span highlight" do
        expect(page).to have_no_selector('.timeline-unfocused')
      end

      it "shows all granule results" do
        expect(granule_list).to have_text('Showing 20 of 39 matching granules')
      end

      it "removes the message indicating not all granule results are being shown" do
        expect(granule_list).to have_no_text('for the selected year')
      end

      it "removes the link to show all granules" do
        expect(granule_list).to have_no_link('Show All')
      end
    end

    context "and zooming the timeline" do
      before(:all) do
        find('.timeline-zoom-in').click
        wait_for_xhr
      end
      after(:all) do
        find('.timeline-zoom-out').click
        click_timeline_date('1987')
      end

      it "removes the time span highlight" do
        expect(page).to have_no_selector('.timeline-unfocused')
      end

      it "shows all granule results" do
        expect(granule_list).to have_text('Showing 20 of 39 matching granules')
      end

      it "removes the message indicating not all granule results are being shown" do
        expect(granule_list).to have_no_text('for the selected year')
      end

      it "removes the link to show all granules" do
        expect(granule_list).to have_no_link('Show All')
      end

      context "clicking another time span" do
        before(:all) { click_timeline_date('Feb', '1989') }
        after(:all) { click_timeline_date('Feb', '1989') }

        it "selects a time span with an appropriately scaled range" do
          expect(page).to have_focused_time_span(start_feb_1989, start_mar_1989)
        end
      end
    end

    context "and panning the timeline" do
      before(:all) { pan_timeline(-1.year) }
      after(:all) { pan_timeline(1.year) }

      it "maintains the selected time span" do
        wait_for_xhr
        expect(granule_list).to have_text('Showing 13 of 13 matching granules')
      end
    end

    context 'and clicking the "Show All" link' do
      before(:all)  do
        click_link('Show All')
        wait_for_xhr
      end

      after(:all) { click_timeline_date('1987') }

      it "removes the time span highlight" do
        expect(page).to have_no_selector('.timeline-unfocused')
      end

      it "shows all granule results" do
        expect(granule_list).to have_text('Showing 20 of 39 matching granules')
      end

      it "removes the message indicating not all granule results are being shown" do
        expect(granule_list).to have_no_text('for the selected year')
      end

      it "removes the link to show all granules" do
        expect(granule_list).to have_no_link('Show All')
      end
    end

    context 'and clicking a different time span' do
      before(:all) { click_timeline_date('1988') }
      after(:all) { click_timeline_date('1987') }

      it "highlights only the new time span" do
        expect(page).to have_focused_time_span(start_1988, start_1989)
      end

      it "shows only granules within the new time span" do
        expect(granule_list).to have_text('Showing 4 of 4 matching granules')
      end

      it "indicates that not all granule results are being shown" do
        expect(granule_list).to have_text('for the selected year')
      end

      it "provides a link to show all granules" do
        expect(granule_list).to have_link('Show All')
      end
    end
  end
end
