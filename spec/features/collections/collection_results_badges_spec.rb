require 'rails_helper'

describe 'Collection results', data_specific: true do
  before :all do
    load_page :search, ac: true, q: 'C1211793450-PODAAC'
  end

  it 'displays a badge for OPeNDAP-enabled collections' do
    expect(page).to have_css('.badge-customizable')
  end
end
