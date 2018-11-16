require 'spec_helper'

describe 'Portal collection filtering' do
  it 'Visiting an Earthdata Search portal restricts visible collections to those matching its configured filter' do
    Capybara.reset_sessions!
    load_page :search, portal: 'simple'

    expect(page).to have_text('1 Matching Collection')
  end
end
