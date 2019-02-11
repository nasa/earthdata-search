require 'rails_helper'

describe 'Collection results' do
  before :all do
    load_page :search, ac: true, q: 'C194001241-LPDAAC_ECS'
  end

  it 'displays a badge for OPeNDAP-enabled collections' do
    expect(page).to have_css('.badge-customizable')
  end
end
