require 'spec_helper'

describe 'Site misc', reset: false do
  before :all do
    load_page :search
  end

  it 'displays the current NASA official' do
    expect(page).to have_content('Stephen Berrick')
  end

  it 'does not display the previous NASA official' do
    expect(page).to have_no_text('Andrew Mitchell')
  end
end
