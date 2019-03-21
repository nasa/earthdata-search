# EDSC-2084
# Disable the use-shapefile checkbox if there was no upload during search

require 'rails_helper'
require 'rake'

describe 'Service options order with use shapefile field', pending_updates: true, single_granule: true do
  collection_id = 'C1200343735-DEV07'

  context 'when viewing service order form' do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, q: collection_id, authenticate: 'edsc', env: :sit
      wait_for_xhr

      first_collection_result.click
      wait_for_xhr

      find('.retrieve').click

      find('.project-list-item-action-edit-options').click
      find('button', text: 'Edit Delivery Method').click
      find('#access-method-' + collection_id + '-02').click
      wait_for_xhr
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'contains a checkbox for using shapefile from search' do
    #   expect(page).to have_selector('input[id=ICESAT2-use-shapefile-element]'
      expect(page).to have_field('ICESAT2-use-shapefile-element', :type => 'checkbox', :disabled => true)
    end

  end
end
