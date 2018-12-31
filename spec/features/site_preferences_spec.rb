require 'rails_helper'

describe 'Site Preferences', reset: true do
  after :each do
    wait_for_xhr
    User.destroy_all if page.server.responsive?
  end

  context 'when user is logged in' do
    before :each do
      load_page :root, authenticate: 'edsc', keep_tour_open: true
    end

    it 'shows the tour' do
      expect(page).to have_css '.sitetour'
    end

    it 'sets site preferences when closing the tour' do
      check 'toggleHideTour'
      click_on 'Close'
      expect(page).to have_no_css '.sitetour'
      wait_for_xhr

      visit '/'
      expect(page).to have_no_css '.sitetour'
    end

    it 'shows Show Tour link after closing the tour' do
      click_on 'Close'
      click_on 'Manage user account'
      expect(page).to have_content 'Show Tour'
    end
  end

  context 'when user is a guest' do
    before :each do
      load_page :root, keep_tour_open: true
    end

    it 'shows the tour' do
      expect(page).to have_css '.sitetour'
    end

    it 'sets site preferences when closing the tour' do
      check 'toggleHideTour'
      click_on 'Close'
      expect(page).to have_no_css '.sitetour'
      wait_for_xhr

      visit '/'
      expect(page).to have_no_css '.sitetour'
    end

    it 'shows Show Tour link after closing the tour' do
      click_on 'Close'
      expect(page).to have_content 'Show Tour'
    end
  end
end
