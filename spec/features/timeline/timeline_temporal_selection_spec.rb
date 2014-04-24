# EDSC-196: As a user, I want to narrow my results by selecting an area on a
#           timeline so I may view granules with desirable temporal overlap

require "spec_helper"

describe "Timeline temporal selection", reset: false do
  extend Helpers::DatasetHelpers

  def date_display(date)
    date.iso8601.gsub('T', ' ').gsub(/\+.*$/, '')
  end

  global_start_date = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
  global_stop_date = DateTime.new(1989, 1, 1, 0, 0, 0, '+0')
  local_start_date = DateTime.new(1986, 1, 1, 0, 0, 0, '+0')
  local_stop_date = DateTime.new(1988, 1, 1, 0, 0, 0, '+0')
  start_drag_date = DateTime.new(1990, 1, 1, 0, 0, 0, '+0')
  stop_drag_date = DateTime.new(1985, 1, 1, 0, 0, 0, '+0')

  before :all do
    visit '/search'
    add_dataset_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
    add_dataset_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

    dataset_results.click_link "View Project"
    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    zoom_out_button.click
    pan_timeline(-25.years)
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

    context 'dragging the start fencepost of the global temporal condition' do
      before(:all) { drag_temporal(global_start_date, start_drag_date) }
      after(:all) { set_temporal(global_start_date, global_stop_date) }

      it 'updates the global temporal condition' do
        expect(page).to have_temporal(global_stop_date, start_drag_date)
      end

      it 'does not update dataset-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end

    context 'dragging the start fencepost of a dataset-specific temporal condition' do
      before(:all) { drag_temporal(local_start_date, start_drag_date) }
      after(:all) { set_temporal(local_start_date, local_stop_date, nil, 0) }

      it 'updates the dataset-specific condition' do
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

      it 'does not update dataset-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end

    context 'dragging the end fencepost of a dataset-specific temporal condition' do
      before(:all) { drag_temporal(local_stop_date, stop_drag_date) }
      after(:all) { set_temporal(local_start_date, local_stop_date, nil, 0) }

      it 'updates the dataset-specific condition' do
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

      it 'sets a new global temporal condition for all datasets' do
        expect(page).to have_temporal(stop_drag_date, start_drag_date)
      end

      it 'does not update dataset-specific conditions' do
        expect(page).to have_temporal(local_start_date, local_stop_date, nil, 0)
      end
    end
  end

  context 'when no temporal conditions are set' do
    context 'dragging the timeline header' do
      before(:all) { drag_temporal(stop_drag_date, start_drag_date) }
      after(:all) { unset_temporal }

      it 'sets a global temporal condition for all datasets' do
        expect(page).to have_temporal(stop_drag_date, start_drag_date)
      end
    end
  end
end
