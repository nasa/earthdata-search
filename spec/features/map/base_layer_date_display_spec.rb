# EDSC-308: Corrected Reflectance Base Layer doesn't track temporal search bounds

require "spec_helper"

describe "Base layer date display", reset: false do
  extend Helpers::CollectionHelpers

  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  start_date = DateTime.new(2014, 2, 10, 12, 30, 0, '+0')
  stop_date = DateTime.new(2014, 2, 20, 16, 30, 0, '+0')

  before :all do
    load_page :search, focus: 'C179003030-ORNL_DAAC'
  end

  before :all do
    zoom_in_button = find('.timeline-zoom-in')
    zoom_in_button.click
    pan_to_time(present)
    wait_for_xhr
  end

  context 'when viewing a time-independent base layer' do
    before(:all) do
      page.find('.leaflet-control-layers').trigger(:mouseover)
      choose 'Land / Water Map'
    end

    context 'selecting a date on the timeline' do
      before(:all) { click_timeline_date('02', 'Feb') }
      after(:all) { click_timeline_date('02', 'Feb') }

      it 'does not update the base layer' do
        expect('#map').to have_tiles_with_no_date
      end
    end
  end

  context 'when viewing a time-dependent base layer' do
    before(:all) do
      page.find('.leaflet-control-layers').trigger(:mouseover)
      choose 'Corrected Reflectance (True Color)'
    end

    it "shows yesterday's imagery by default" do
      expect('#map').to have_tiles_with_date('2014-02-28')
    end

    context 'selecting a date on the timeline' do
      before(:all) { click_timeline_date('02', 'Feb') }
      after(:all) { click_timeline_date('02', 'Feb') }

      it 'updates the selected base layer to show that date' do
        expect('#map').to have_tiles_with_date('2014-02-02')
      end
    end

    context 'selecting a temporal range' do
      before(:all) { set_temporal(start_date, stop_date) }
      after(:all) { unset_temporal }

      it 'updates the selected base layer to show the end date of the temporal range' do
        expect('#map').to have_tiles_with_date('2014-02-20')
      end
    end

    context 'selecting a temporal start date only' do
      before(:all) { set_temporal(start_date) }
      after(:all) { unset_temporal }

      it "shows yesterday's imagery" do
        expect('#map').to have_tiles_with_date('2014-02-28')
      end
    end

    context 'selecting both a temporal range and a date on the timeline' do
      before(:all) do
        set_temporal(start_date, stop_date)
        click_timeline_date('15', 'Feb')
      end

      after(:all) do
        click_timeline_date('15', 'Feb')
        unset_temporal
      end

      it 'updates the selected base layer to show the date selected on the timeline' do
        expect('#map').to have_tiles_with_date('2014-02-15')
      end
    end
  end

end
