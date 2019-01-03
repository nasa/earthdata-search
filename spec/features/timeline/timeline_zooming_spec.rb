require 'rails_helper'

describe 'Timeline zooming' do
  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  month_start = DateTime.new(2014, 1, 31, 2, 30, 0, '+0')
  month_end = DateTime.new(2014, 3, 3, 2, 30, 0, '+0')

  decade_start = DateTime.new(2009, 2, 11, 14, 30, 0, '+0')
  decade_end = DateTime.new(2019, 2, 19, 14, 30, 0, '+0')

  before :all do
    load_page :search, focus: 'C179003030-ORNL_DAAC'

    set_temporal(DateTime.new(2014, 2, 10, 12, 30, 0, '+0'), DateTime.new(2014, 2, 20, 16, 30, 0, '+0'))

    pan_to_time(present)
    wait_for_xhr
  end

  context 'when zooming in on the timeline' do
    before(:all) { click_timeline_zoom_in }
    after(:all)  { click_timeline_zoom_out }

    it 'shows a new time range with updated intervals' do
      expect(page).to have_timeline_range(month_start, month_end)
    end

    it 'displays a label indicating the size of the timeline intervals' do
      expect(page).to have_content('DAY')
    end

    it 'displays interval labels with month and year' do
      expect(page).to have_content("01\nFeb 2014")
    end

    it 'fetches new data' do
      synchronize do
        loaded_resolution = page.evaluate_script("$('#timeline').timeline('debug__loadedRange')[2]")
        expect(loaded_resolution).to eql('hour')
      end
    end

    context 'to hour resolution' do
      before(:all) { click_timeline_zoom_in }
      after(:all)  { click_timeline_zoom_out }

      it 'disables the zoom-in button' do
        expect(page).to have_selector('.timeline-min-zoom')
      end

      it 'displays interval labels with day month and year' do
        expect(page).to have_content("00:00\n16 Feb 2014")
      end
    end
  end

  context 'when zooming out on the timeline' do
    before(:all) { click_timeline_zoom_out }
    after(:all) { click_timeline_zoom_in }

    it 'shows a new time range with updated intervals' do
      expect(page).to have_timeline_range(decade_start, decade_end)
    end

    it 'displays a label indicating the size of the timeline intervals' do
      expect(page).to have_content('YEAR')
    end

    it 'fetches new data' do
      synchronize do
        loaded_resolution = page.evaluate_script("$('#timeline').timeline('debug__loadedRange')[2]")
        expect(loaded_resolution).to eql('month')
      end
    end

    context 'to year resolution' do
      before(:all) { click_timeline_zoom_out }
      after(:all) { click_timeline_zoom_in }

      it 'disables the zoom-out button' do
        expect(page).to have_selector('.timeline-max-zoom')
      end
    end
  end
end
