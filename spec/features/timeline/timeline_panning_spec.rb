# EDSC-198: As a user, I want to pan the granule timeline so I may view time
#           periods before and after those currently visible

require "spec_helper"

describe "Timeline panning", reset: false do
  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')
  start = present - 365.days

  before :all do
    load_page :search, project: ['C179003030-ORNL_DAAC'], view: :project, temporal: [DateTime.new(2014, 2, 10, 12, 30, 0, '+0')]
    #load_page :search

    #add_collection_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

    #set_temporal(DateTime.new(2014, 2, 10, 12, 30, 0, '+0'), DateTime.new(2014, 2, 20, 16, 30, 0, '+0'))

    #collection_results.click_link "View Project"
    wait_for_xhr
    pan_to_time(present)
    wait_for_xhr
  end

  context "when dragging the timeline" do
    before(:all) { pan_timeline(-25.days) }
    after(:all)  { pan_timeline( 25.days) }

    it "moves the timeline display" do
      expect(page).to have_timeline_range(start - 25.days, present - 25.days)
      expect(page).to have_time_offset('.timeline-draggable', -25.days)
    end

    it "moves the selected temporal extents" do
      expect(page).to have_time_offset('.timeline-selection', -25.days)
    end

    it "keeps collection names in their original location" do
      expect(page).to have_time_offset('.timeline-overlay', 0.seconds)
    end
  end

  context "when dragging beyond the present" do
    before(:all) { pan_timeline(25.days) }
    after(:all) { pan_timeline(-25.days) }

    it "allows the user to pan into the future" do
      expect(page).to have_timeline_range(start + 25.days, present + 25.days)
    end
  end
end
