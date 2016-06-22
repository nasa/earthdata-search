# EDSC-189: As a user, I want to choose which day is displayed for my displayed
#           granules so I may view results across multiple days

require "spec_helper"

describe "Timeline date selection", reset: false do
  extend Helpers::CollectionHelpers

  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  start_1986 = DateTime.new(1986, 1, 1, 0, 0, 0, '+0')
  start_1987 = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  start_1988 = DateTime.new(1988, 1, 1, 0, 0, 0, '+0')
  start_1989 = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')
  start_jan_1987 = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  start_feb_1987 = DateTime.new(1987, 2, 1, 0, 0, 0, '+0')
  start_mar_1987 = DateTime.new(1987, 3, 1, 0, 0, 0, '+0')
  start_apr_1987 = DateTime.new(1987, 4, 1, 0, 0, 0, '+0')

  temporal_start_date = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  temporal_stop_date = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')

  before :all do
    load_page :search, focus: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    pan_to_time(present - 20.years)
    wait_for_xhr
    expect(granule_list).to have_text('Showing 20 of 39 matching granules')
  end

  context 'when a temporal constraint is set' do
    before(:all) { set_temporal(temporal_start_date, temporal_stop_date) }
    after(:all) { unset_temporal }

    context "and zooming out the timeline" do
      before(:all) do
        find('.timeline-zoom-out').click
        wait_for_xhr
      end

      after(:all) do
        find('.timeline-zoom-in').click
        unset_temporal
        pan_to_time(present - 20.years)
        set_temporal(temporal_start_date, temporal_stop_date)
        wait_for_xhr
      end

      it 'centers the temporal constraint' do
        expect(page).to have_highlighted_selection(temporal_start_date, temporal_stop_date)
        # timeline range: 1962-12-13T12:00:00+00:00 - 2013-01-19T12:00:00+00:00
        expect(page).to have_timeline_range(present - 51.years - 3.months, present - 1.year - 2.months)
      end
    end

    context "and zooming in the timeline" do
      before(:all) do
        find('.timeline-zoom-in').click
        wait_for_xhr
      end

      after(:all) do
        find('.timeline-zoom-out').click
        unset_temporal
        pan_to_time(present - 20.years)
        set_temporal(temporal_start_date, temporal_stop_date)
        wait_for_xhr
      end

      it 'centers the temporal constraint' do
        expect(page).to have_highlighted_selection(temporal_start_date, temporal_stop_date)
        #timeline range: 1987-07-02T12:00:00+00:00 - 1988-07-02T12:00:00+00:00
        expect(page).to have_timeline_range(present - 27.years + 4.months, present - 26.years + 4.months)
      end
    end

    context 'clicking on a date within the temporal constraint' do
      before(:all) { click_timeline_date('1987') }
      after(:all) { click_timeline_date('1987') }

      it 'sets the focused time span to the given date' do
        expect(page).to have_focused_time_span(start_1987, start_1988)
      end

      context 'and arrowing to a date outside of the constraint' do
        before(:all) { keypress('#timeline .timeline-container', :left); wait_for_xhr }

        it 'does not update the focused time span' do
          expect(page).to have_focused_time_span(start_1987, start_1988)
        end

        it 'does not pan the timeline' do
          expect(page).to have_end_time(-20.years)
        end
      end

      context 'clicking on a date outside of the temporal constraint' do
        before(:all) { click_timeline_date('1986') }

        it 'does not set the focused time span' do
          expect(page).to have_focused_time_span(start_1987, start_1988)
        end
      end
    end

    context 'clicking on a date outside of the temporal constraint' do
      before(:all) { click_timeline_date('1986') }

      it 'does not set the focused time span' do
        expect(page).to have_no_selector('.timeline-unfocused')
      end
    end
  end

  context "clicking on a time span in the time line" do
    before(:all) { click_timeline_date('1987') }
    after(:all) { click_timeline_date('1987') }

    it "highlights the selected time span" do
      expect(page).to have_focused_time_span(start_1987, start_1988)
    end

    it "shows only granules within that time span" do
      expect(granule_list).to have_text('Showing 12 of 12 matching granules')
    end


    it "indicates that not all granule results are being shown" do
      expect(granule_list).to have_text('for the selected year')
    end

    it "provides a link to show all granules" do
      expect(granule_list).to have_link('Show All')
    end

    context "pressing the left arrow key" do
      before(:all) { keypress('#timeline .timeline-container', :left); wait_for_xhr }
      after(:all) { keypress('#timeline .timeline-container', :right); wait_for_xhr }

      it "selects the previous time span" do
        expect(page).to have_focused_time_span(start_1986, start_1987)
      end

      it "pans the timeline to center on the previous time span" do
        expect(page).to have_end_time(-21.years)
      end
    end

    context "pressing the right arrow key" do
      before(:all) { keypress('#timeline .timeline-container', :right); wait_for_xhr; }
      after(:all) { keypress('#timeline .timeline-container', :left); wait_for_xhr }

      it "selects the next time span" do
        expect(page).to have_focused_time_span(start_1988, start_1989)
      end

      it "pans the timeline to center on the next time span" do
        expect(page).to have_end_time(-19.years)
      end
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

    context "and zooming out the timeline" do
      before(:all) do
        find('.timeline-zoom-out').click
        wait_for_xhr
      end
      after(:all) do
        find('.timeline-zoom-in').click
        wait_for_xhr
        pan_to_time(present - 20.years)
        wait_for_xhr
        click_timeline_date('1987')
        wait_for_xhr
      end

      it "centers the selected time span" do
        expect(page).to have_timeline_range(present - 52.years, present - 2.years)
      end
    end

    context "and zooming in the timeline" do
      before(:all) do
        load_page :search, focus: 'C179003030-ORNL_DAAC'
        wait_for_xhr
        find('.timeline-zoom-out').click
        pan_to_time(present - 20.years)
        wait_for_xhr
        click_timeline_date('1987')
        find('.timeline-zoom-in').click
        wait_for_xhr
      end
      after(:all) do
        find('.timeline-zoom-out').click
        wait_for_xhr
        pan_to_time(present - 20.years)
        wait_for_xhr
        click_timeline_date('1987')
        wait_for_xhr
      end

      # OBE since EDSC-520
      # it "removes the time span highlight" do
      #   expect(page).to have_no_selector('.timeline-unfocused')
      # end

      it "centers the selected time span" do
        expect(page).to have_timeline_range(present - 326.months, present - 314.months)
      end

      # OBE since EDSC-520
      # it "shows all granule results" do
      #   expect(granule_list).to have_text('Showing 20 of 39 matching granules')
      # end

      it "removes the message indicating not all granule results are being shown" do
        expect(granule_list).to have_no_text('for the selected year')
      end

      # OBE since EDSC-520
      # it "removes the link to show all granules" do
      #   expect(granule_list).to have_no_link('Show All')
      # end

      context "clicking another time span" do
        before(:all) do
          click_timeline_date('Feb', '1987')
        end
        after(:all) { click_timeline_date('Feb', '1987') }

        it "selects a time span with an appropriately scaled range" do
          expect(page).to have_focused_time_span(start_feb_1987, start_mar_1987)
        end

        context "pressing the left arrow key" do
          before(:all) { keypress('#timeline .timeline-container', :left); wait_for_xhr }
          after(:all) { keypress('#timeline .timeline-container', :right); wait_for_xhr }

          it "selects the previous scaled time span" do
            expect(page).to have_focused_time_span(start_jan_1987, start_feb_1987)
          end
        end

        context "pressing the right arrow key" do
          before(:all) { keypress('#timeline .timeline-container', :right); wait_for_xhr }
          after(:all) { keypress('#timeline .timeline-container', :left); wait_for_xhr }

          it "selects the next scaled time span" do
            expect(page).to have_focused_time_span(start_mar_1987, start_apr_1987)
          end
        end
      end
    end

    context "and panning the timeline" do
      before(:all) { pan_timeline(-1.year) }
      after(:all) { pan_timeline(1.year); wait_for_xhr }

      it "maintains the selected time span" do
        wait_for_xhr
        expect(granule_list).to have_text('Showing 12 of 12 matching granules')
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
