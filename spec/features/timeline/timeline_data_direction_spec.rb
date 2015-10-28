require "spec_helper"

describe "Timeline data direction", reset: false do
  before :all do
    load_page :search, focus: 'C179003030-ORNL_DAAC'

    wait_for_xhr
  end

  context "when the timeline shows data for a collection" do
    end_date = DateTime.new(1987, 3, 1, 0, 0, 0, '+0')
    before :all do
      pan_to_time(end_date - 6.months)
      wait_for_xhr
    end

    it "shows no indicator that there is earlier data" do
      expect(page).to have_css('#arrow-left-C179003030-ORNL_DAAC[style="fill: transparent"]')
    end

    it "shows no indicator that there is later data" do
      expect(page).to have_css('#arrow-right-C179003030-ORNL_DAAC[style="fill: transparent"]')
    end
  end

  context "when the timeline is scrolled to before a collection's first data" do
    end_date = DateTime.new(1971, 1, 1, 0, 0, 0, '+0')
    before :all do
      pan_to_time(end_date - 6.months)
      wait_for_xhr
    end

    it "shows no indicator that there is earlier data" do
      expect(page).to have_css('#arrow-left-C179003030-ORNL_DAAC[style="fill: transparent"]')
    end

    it "shows an indicator that there is later data" do
      expect(page).to have_css('#arrow-right-C179003030-ORNL_DAAC[style="fill: #25c85b"]')
    end
  end

  context "when the timeline is scrolled to after a collection's first data" do
    end_date = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')
    before :all do
      pan_to_time(end_date - 6.months)
      wait_for_xhr
    end

    it "shows an indicator that there is earlier data" do
      expect(page).to have_css('#arrow-left-C179003030-ORNL_DAAC[style="fill: #25c85b"]')
    end

    it "shows no indicator that there is later data" do
      expect(page).to have_css('#arrow-right-C179003030-ORNL_DAAC[style="fill: transparent"]')
    end
  end
end
