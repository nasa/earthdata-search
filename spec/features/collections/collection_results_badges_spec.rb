require 'rails_helper'

describe 'Collection results', data_specific: true do
  before :all do
    load_page :search, ac: true
  end

  it 'displays a badge for OPeNDAP-enabled collections' do
    fill_in 'keywords', with: 'C1211793450-PODAAC'
    wait_for_xhr
    expect(page).to have_css('.badge-customizable')
  end
end
