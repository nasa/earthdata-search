require "spec_helper"

describe "Granule result removal", reset: false do
  first_granule_temporal = '1988-03-01 00:00:00 1988-03-04 00:00:00'
  second_granule_temporal = '1988-02-01 00:00:00 1988-03-01 00:00:00'

  context 'pressing the delete key while focused on a granule' do
    before :all do
      load_page :search, focus: 'C179003030-ORNL_DAAC'
      first_granule_list_item.click
      keypress('#granule-list', :delete)
      wait_for_xhr
    end

    it 'removes the granule from the granule list' do
      expect(page).to have_css('#granule-list .panel-list-item', count: 19)
    end

    it "updates the page's hits count" do
      expect(granule_list).to have_content("Showing 19 of 38 matching granules")
    end

    it "focuses the next granule in the list" do
      expect(granule_list).to have_selector('.panel-list-selected', count: 1, text: second_granule_temporal)
    end

    it "focuses the next granule on the map" do
      expect(page).to have_selector('.granule-spatial-label-temporal', count: 1, text: second_granule_temporal)
    end
  end

  context 'pressing the delete key while not focused on a granule' do
    before :all do
      load_page :search, focus: 'C179003030-ORNL_DAAC'
      keypress('#granule-list', :delete)
      wait_for_xhr
    end

    it 'does nothing' do
      expect(page).to have_css('#granule-list .panel-list-item', count: 20)
    end
  end
end
