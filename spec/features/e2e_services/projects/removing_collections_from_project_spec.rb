require 'rails_helper'

describe 'When viewing the project page with more than one collection' do
  before :all do
    load_page :projects_page, project: ['C1000000969-DEV08', 'C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
  end

  it 'shows multiple collection cards' do
    expect(page).to have_css('.project-list-item-content', count: 2)
  end

  it 'displays 2 collections in the summary' do
    wait_for_xhr
    within '.project-stats .project-stats-collection-count' do
      expect(page).to have_content('2 Collections')
    end
  end

  context 'When removing a collection' do
    before :all do
      project_list_item = find('.project-list-item', match: :first)
      project_list_item.find('.button-icon-ellipsis').click
      project_list_item.find('.project-list-item-remove').click
    end

    it 'shows only one collection card' do
      expect(page).to have_css('.project-list-item-content', count: 1)
    end

    it 'displays 1 collection in the summary' do
      wait_for_xhr
      within '.project-stats .project-stats-collection-count' do
        expect(page).to have_content('1 Collection')
      end
    end

    context 'When removing the last collection' do
      before :all do
        project_list_item = find('.project-list-item', match: :first)
        project_list_item.find('.button-icon-ellipsis').click
        project_list_item.find('.project-list-item-remove').click
      end

      it 'displays an appropriate message to the user' do
        expect(page).to have_content('Your project is empty. Click here to return to search and add collections to your project.')
      end
    end
  end
end
