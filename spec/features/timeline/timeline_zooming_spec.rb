# EDSC-197 : As a user, I want to zoom in and out of the granule timeline so I
#            may view data with the appropriate resolution

require "spec_helper"

describe "Timeline zooming", reset: false do
  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  day_start = DateTime.new(2014, 2, 13, 0, 0, 0, '+0')
  day_end = DateTime.new(2014, 2, 14, 0, 0, 0, '+0')

  year_start = DateTime.new(2013, 8, 14, 12, 0, 0, '+0')
  year_end = DateTime.new(2014, 8, 15, 12, 0, 0, '+0')

  start = present - 31.days

  before :all do
    visit '/search'

    add_dataset_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

    set_temporal(DateTime.new(2014, 2, 10, 12, 30, 0, '+0'), DateTime.new(2014, 2, 20, 16, 30, 0, '+0'))

    dataset_results.click_link "View Project"
    wait_for_xhr
  end

  context "when zooming in on the timeline" do
    before(:all) { find('.timeline-zoom-in').click }
    after(:all)  { find('.timeline-zoom-out').click }

    it "shows a new time range with updated intervals" do
      expect(page).to have_timeline_range(day_start, day_end)
    end

    it "displays a label indicating the size of the timeline intervals" do
      expect(page).to have_content('HOUR')
    end

    it "fetches new data" do
      synchronize do
        loaded_resolution = page.evaluate_script("$('#timeline').timeline('debug__loadedRange')[2]")
        expect(loaded_resolution).to eql('minute')
      end
    end

    context "to hour resolution" do
      it "disables the zoom-in button" do
        expect(page).to have_selector('.timeline-min-zoom')
      end
    end
  end


  context "when zooming out on the timeline" do
    before(:all) { find('.timeline-zoom-out').click }
    after(:all) { find('.timeline-zoom-in').click }

    after(:all) do
      btn = find('.timeline-zoom-in')
      btn.click
      btn.click
    end

    it "shows a new time range with updated intervals" do
      expect(page).to have_timeline_range(year_start, year_end)
    end

    it "displays a label indicating the size of the timeline intervals" do
      expect(page).to have_content('MONTH')
    end

    it "fetches new data" do
      synchronize do
        loaded_resolution = page.evaluate_script("$('#timeline').timeline('debug__loadedRange')[2]")
        expect(loaded_resolution).to eql('day')
      end
    end

    context "to year resolution" do
      before(:all) do
        find('.timeline-zoom-out').click
        find('.timeline-zoom-out').click
      end
      after(:all) do
        find('.timeline-zoom-in').click
        find('.timeline-zoom-in').click
      end

      it "disables the zoom-out button" do
        expect(page).to have_selector('.timeline-max-zoom')
      end
    end
  end
end
