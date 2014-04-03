# EDSC-198: As a user, I want to pan the granule timeline so I may view time
#           periods before and after those currently visible

require "spec_helper"

describe "Timeline panning", reset: false do
  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')
  start = present - 31.days

  before :all do
    visit '/search'

    add_dataset_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

    set_temporal(DateTime.new(2014, 2, 10, 12, 30, 0, '+0'), DateTime.new(2014, 2, 20, 16, 30, 0, '+0'))

    dataset_results.click_link "View Project"
    wait_for_xhr
  end

  context "when dragging the timeline" do
    before(:all) { pan_timeline(-5.days) }
    after(:all)  { pan_timeline( 5.days) }

    it "moves the timeline display" do
      expect(page).to have_timeline_range(start - 5.day, present - 5.days)
      expect(page).to have_time_offset('.timeline-draggable', -5.days)
    end

    it "moves the selected temporal extents" do
      expect(page).to have_time_offset('.timeline-selection', -5.days)
    end

    it "keeps dataset names in their original location" do
      expect(page).to have_time_offset('.timeline-overlay', 0.seconds)
    end
  end

  context "when dragging beyond the present" do
    before(:all) { pan_timeline(5.days) }

    it "stops panning the timeline display at the present" do
      expect(page).to have_timeline_range(start, present)
    end
  end
end
