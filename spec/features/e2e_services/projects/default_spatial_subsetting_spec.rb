require 'rails_helper'

describe 'Default Spatial Subsetting' do
  before :all do
    # Don't process retrievals
    Delayed::Worker.delay_jobs = true
  end

  after :all do
    Delayed::Worker.delay_jobs = false
  end

  context 'when visiting a new project with spatial constraints applied' do
    before :all do
      load_page :projects_page, project: ['C1000001167-NSIDC_ECS'], bounding_box: [0, 30, 10, 40], temporal: ['2019-02-01T00:00:00Z', '2019-02-01T23:59:59Z'], authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)

      wait_for_xhr

      choose('Customize')
      check 'Enter bounding box'
    end

    it 'populates the bounding box with your spatial constraints' do
      expect(page).to have_field('North', with: '10', disabled: true)
      expect(page).to have_field('West', with: '30', disabled: true)
      expect(page).to have_field('East', with: '40', disabled: true)
      expect(page).to have_field('South', with: '0', disabled: true)
    end

    context 'when revisiting a project with the spatial constraints removed' do
      before :all do
        page.find_button('Download Data', disabled: false).click
        wait_for_xhr

        load_page :projects_page, project: ['C1000001167-NSIDC_ECS'], temporal: ['2019-02-01T00:00:00Z', '2019-02-01T23:59:59Z'], authenticate: 'edsc'

        collection_card = find('.project-list-item', match: :first)
        wait_for_xhr

        check 'Enter bounding box'
      end

      it 'does not prepopulate the bounding box fields with the previous values' do
        expect(page).to have_field('North', with: '90', disabled: true)
        expect(page).to have_field('West', with: '-180', disabled: true)
        expect(page).to have_field('East', with: '180', disabled: true)
        expect(page).to have_field('South', with: '-90', disabled: true)
      end
    end
  end
end
