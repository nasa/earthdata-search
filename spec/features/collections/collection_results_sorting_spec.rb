require 'spec_helper'

describe 'Collection results sorting', reset: false do
  before :all do
    load_page :search
  end

  it 'offers the correct sorting options' do
    expect(page).to have_select('Sort by', options: ['Relevance', 'Usage', 'End Date'])
  end

  it 'sorts by relevance by default' do
    expect(page).to have_select('Sort by', selected: 'Relevance')
  end
end
