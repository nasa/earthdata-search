require 'rails_helper'

describe 'Service options order with use shapefile field' do
  context 'when viewing service order form' do
    before :all do
      load_page :projects_page, project: ['C1200343735-DEV07'], authenticate: 'edsc', env: :sit

      choose('Customize')
      wait_for_xhr
    end

    it 'contains a disabled checkbox for using shapefile from search' do
      expect(page).to have_field('ICESAT2-use-shapefile-element', type: 'checkbox', disabled: true)
    end
  end
end
