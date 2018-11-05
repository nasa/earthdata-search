require "spec_helper"

describe "Project collection color coding", reset: false do
  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  first_color_hex = '#3498DB'
  first_color_rgb = 'rgb(52, 152, 219)'
  second_color_hex = '#E67E22'
  second_color_rgb = 'rgb(230, 126, 34)'

  before(:all) do
    Capybara.reset_sessions!
    load_page :search, q: 'Minute FIFE'

    view_granule_results
    zoom_out_button = find('.timeline-zoom-out')
    zoom_out_button.click
    pan_to_time(present - 20.years)
    wait_for_xhr
    leave_granule_results
  end

  context 'viewing collection results' do
    it 'shows no color indicator' do
      expect(first_collection_result).to have_no_css("*[style*=\"#{first_color_rgb}\"]")
    end
  end

  context 'in the granule view for collections not in a project' do
    before(:all) { view_granule_results }
    # after(:all) { leave_granule_results }

    it 'uses the default color for granule footprints' do
      map_mousemove('#map', 39.1, -96.6)
      expect(page).to have_selector(".leaflet-overlay-pane path")
      expect(page).to have_no_selector(".leaflet-overlay-pane path[stroke=\"#{first_color_hex}\"]")
    end

    it 'uses the default color in the timeline' do
      expect(page.find('#timeline .C179003030-ORNL_DAAC')).to have_css("rect")
      expect(page.find('#timeline .C179003030-ORNL_DAAC')).to have_no_css("rect[style*=\"#{first_color_hex}\"]")
    end
  end
end
