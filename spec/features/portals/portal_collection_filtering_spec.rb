require 'rails_helper'

describe 'Portal collection filtering' do
  before do
    load_page :search, portal: 'simple'
  end

  it 'Visiting an Earthdata Search portal restricts visible collections to those matching its configured filter' do
    expect(page).to have_text('1 Matching Collection')
  end
end
