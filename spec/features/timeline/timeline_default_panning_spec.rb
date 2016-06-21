require "spec_helper"

describe "Timeline default panning", reset: false do
  collection_end = DateTime.new(1988, 3, 4, 0, 0, 0, '+0')

  context "when the timeline range is before the time span of all currently visible collections" do
    end_date = DateTime.new(1971, 1, 1, 0, 0, 0, '+0')

    before :all do
      load_page :search, project: ['C179003030-ORNL_DAAC'], view: :project, timeline: end_date - 6.months
      wait_for_xhr
    end

    it "pans the timeline to one appropriate for the visible collections" do
      expect(page).to have_timeline_range(collection_end - 1.year, collection_end)
    end
  end

  context "when the timeline range is within the time span of currently visible collections" do
    end_date = DateTime.new(1985, 3, 1, 0, 0, 0, '+0')

    before :all do
      load_page :search, project: ['C179003030-ORNL_DAAC'], view: :project, timeline: end_date - 6.months
      wait_for_xhr
    end

    it "does not pan the timeline" do
      expect(page).to have_timeline_range(end_date - 1.year, end_date)
    end
  end

  context "when the timeline range is after the time span of all currently visible collections" do
    end_date = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

    before :all do
      load_page :search, project: ['C179003030-ORNL_DAAC'], view: :project, timeline: end_date - 6.months
      wait_for_xhr
    end

    it "pans the timeline to one appropriate for the visible collections" do
      expect(page).to have_timeline_range(collection_end - 1.year, collection_end)
    end
  end
end
