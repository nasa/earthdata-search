require "spec_helper"

describe "Temporal constraint disambiguation", reset: true do

  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')
  temporal_start_date = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  temporal_stop_date = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')

  before :each do
    load_page :search, focus: 'C179003030-ORNL_DAAC'
    login

    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    pan_to_time(present - 20.years)
    wait_for_xhr
    expect(granule_list).to have_text('Showing 20 of 39 matching granules')
  end

  context 'when a temporal constraint is set and no date is focused' do
    before(:each) do
      set_temporal(temporal_start_date, temporal_stop_date)
      wait_for_xhr
    end

    context 'clicking the download button' do
      before(:each) { find('.master-overlay-global-actions').click_on "Retrieve collection data" }

      it 'takes the user to the access configuration page with the temporal constraint applied' do
        expect(page).to have_content("15 Granules")
      end
    end
  end

  context 'when a date is focused and no temporal constraint is set' do
    before(:each) do
      click_timeline_date('1987')
      wait_for_xhr
    end

    context 'clicking the download button' do
      before(:each) { find('.master-overlay-global-actions').click_on "Retrieve collection data" }

      it 'takes the user to the access configuration page for the granules on the selected date' do
        expect(page).to have_content("12 Granules")
      end
    end
  end

  context 'a date is focused and and a temporal constraint is set' do
    before(:each) do
      click_timeline_date('1987')
      set_temporal(temporal_start_date, temporal_stop_date)
      wait_for_xhr
    end

    context 'clicking the download button' do
      before(:each) { find('.master-overlay-global-actions').click_on "Retrieve collection data" }

      it 'presents the user with a dialog to choose temporal behavior' do
        expect(page).to have_content("What temporal selection would you like to use?")
      end

      context 'choosing to use the temporal constraint' do
        before(:each) { click_on "Use Temporal Constraint" }

        it 'takes the user to the access configuration page with the temporal constraint applied' do
          expect(page).to have_content("15 Granules")
        end
      end

      context 'choosing to use the timeline focus' do
        before(:each) { click_on "Use Focused Time Span" }

        it 'takes the user to the access configuration page for the granules on the selected date' do
          expect(page).to have_content("12 Granules")
        end
      end
    end
  end

end
