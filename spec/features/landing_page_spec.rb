# EDSC-5 As a user, I want to see a simple search interface upon visiting the site
#        so that I may quickly begin my search for datasets

require 'spec_helper'

describe 'Site landing page' do

  before do
    visit "/"
  end

  it "displays a simplified search interface" do
    expect(page).to have_link('Temporal')
    expect(page).to have_link('Spatial')
    expect(page).to have_no_link('Clear Filters')
  end

  it 'reveals the full search interface when the user enters a keyword and presses "enter"' do
    fill_in "keywords", with: "A"
    keypress_script = "var e = $.Event('keypress', { which: 13 }); $('#keywords').trigger(e); null;"
    page.execute_script(keypress_script)

    expect(page).to have_link('Clear Filters')
  end

  it 'does not reveal the full search interface when the user enters a keyword without pressing "enter"' do
    fill_in "keywords", with: "A"
    expect(page).to have_no_link('Clear Filters')
  end

  it 'reveals the full search interface when the user clicks "Browse All Data"' do
    click_link "Browse All Data"
    expect(page).to have_link('Clear Filters')
  end

  it "reveals the full search interface when the user applies a temporal filter" do
    click_link "Temporal"
    fill_in "End", with: "2013-12-01 00:00:00"
    # Do this in Javascript because of capybara clickfailed bug
    page.execute_script("$('#temporal-submit:visible').click()")
    expect(page).to have_link('Clear Filters')
  end

  it "reveals the full search interface when the user selects a spatial tool" do
    click_link "Spatial"
    # Do this in Javascript because of capybara clickfailed bug
    page.execute_script("$('.dropdown-menu .select-point:visible').click()")
    expect(page).to have_link('Clear Filters')
  end

  it 'reveals the full serach interface when the user loads  "/search" directly' do
    visit "/search"
    expect(page).to have_link('Clear Filters')
  end
end
