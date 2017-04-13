# EDSC-5 As a user, I want to see a simple search interface upon visiting the site
#        so that I may quickly begin my search for collections

require 'spec_helper'

describe 'Site misc' do

  before :all do
    load_page :search
  end

  it 'displays the current NASA official' do
    expect(page).to have_text('Stephen Berrick')
  end

  it 'does not display the previous NASA official' do
    expect(page).to have_no_text('Andrew Mitchell')
  end
end
