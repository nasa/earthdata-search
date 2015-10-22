# EDSC-196: As a user, I want to narrow my results by selecting an area on a
#           timeline so I may view granules with desirable temporal overlap

require "spec_helper"

describe "Timeline temporal selection", reset: false do
  extend Helpers::CollectionHelpers

  def date_display(date)
    date.iso8601.gsub('T', ' ').gsub(/\+.*$/, '')
  end

  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  global_start_date = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  global_stop_date = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')
  local_start_date = DateTime.new(1986, 1, 1, 0, 0, 0, '+0')
  local_stop_date = DateTime.new(1988, 1, 1, 0, 0, 0, '+0')
  start_drag_date = DateTime.new(1990, 1, 1, 0, 0, 0, '+0')
  stop_drag_date = DateTime.new(1985, 1, 1, 0, 0, 0, '+0')

  before :all do
    load_page :search
    add_collection_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
    add_collection_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

    collection_results.click_link "View Project"
    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    pan_to_time(present - 25.years)

    wait_for_xhr
  end

  context 'when temporal conditions are set outside of the timeline' do
    before :all do
      set_temporal(local_start_date, local_stop_date, nil, 0)
      set_temporal(global_start_date, global_stop_date)
    end

    after :all do
      unset_temporal
      unset_temporal(0)
    end

    context 'clicking on the timeline header' do
      before(:all) { page.execute_script("$('.timeline-display-top').click()") }
      after(:all) do
        set_temporal(local_start_date, local_stop_date, nil, 0)
        set_temporal(global_start_date, global_stop_date)
      end

      it 'clears the temporal constraint' do
        expect(page).to have_no_temporal
      end

      it 'clears collection-specific temporal constraints' do
        expect(page).to have_no_temporal(0)
      end
    end

    context 'clicking on the close link in the temporal constraint display' do
      before(:all) { click_link 'Remove temporal constraint' }
      after(:all) { set_temporal(global_start_date, global_stop_date) }

      it 'clears the global temporal constraint' do
        expect(page).to have_no_temporal
      end

      it 'does not clear collection-specific temporal constraints' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end

    context 'dragging the start fencepost of the global temporal condition' do
      before(:all) { drag_temporal(global_start_date, start_drag_date) }
      after(:all) { set_temporal(global_start_date, global_stop_date) }

      it 'updates the global temporal condition' do
        expect(page).to have_temporal(global_stop_date, start_drag_date)
      end

      it 'does not update collection-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end

    context 'dragging the start fencepost of a collection-specific temporal condition' do
      before(:all) { drag_temporal(local_start_date, start_drag_date) }
      after(:all) { set_temporal(local_start_date, local_stop_date, nil, 0) }

      it 'updates the collection-specific condition' do
        expect(page).to have_temporal(local_stop_date, start_drag_date, nil, 0)
      end

      it 'does not update the global temporal condition' do
        expect(page).to have_temporal(global_start_date, global_stop_date)
      end
    end

    context 'dragging the end fencepost of the global temporal condition' do
      before(:all) { drag_temporal(global_stop_date, stop_drag_date) }
      after(:all) { set_temporal(global_start_date, global_stop_date) }

      it 'updates the global temporal condition' do
        expect(page).to have_temporal(stop_drag_date, global_start_date)
      end

      it 'does not update collection-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end

    context 'dragging the end fencepost of a collection-specific temporal condition' do
      before(:all) { drag_temporal(local_stop_date, stop_drag_date) }
      after(:all) { set_temporal(local_start_date, local_stop_date, nil, 0) }

      it 'updates the collection-specific condition' do
        expect(page).to have_temporal(stop_drag_date, local_start_date, nil, 0)
      end

      it 'does not update the global temporal condition' do
        expect(page).to have_temporal(global_start_date, global_stop_date)
      end
    end

    context 'dragging the timeline header outside of the selected range' do
      before(:all) { drag_temporal(stop_drag_date, start_drag_date) }
      after(:all) do
        set_temporal(local_start_date, local_stop_date, nil, 0)
        set_temporal(global_start_date, global_stop_date)
      end

      it 'sets a new global temporal condition for all collections' do
        expect(page).to have_temporal(stop_drag_date, start_drag_date)
      end

      it 'does not update collection-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end
  end

  context 'when no temporal conditions are set' do
    context 'dragging the timeline header' do
      before(:all) { drag_temporal(stop_drag_date, start_drag_date) }
      after(:all) { unset_temporal }

      it 'sets a global temporal condition for all collections' do
        expect(page).to have_temporal(stop_drag_date, start_drag_date)
      end
    end
  end
end
