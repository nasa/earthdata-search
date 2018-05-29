require 'spec_helper'

describe 'Add to project', reset: false do
  context 'in the granule results tab' do
    before :all do
      Capybara.reset_sessions!

      load_page :search, focus: 'C179003030-ORNL_DAAC'
    end

    after :all do
      reset_project
    end

    it 'displays the `Add` button' do
      within '.master-overlay-global-actions' do
        expect(page).to have_link('Add collection to the current project')
        expect(page).to have_no_link('Remove collection from the current project')
      end
    end

    context 'clicking on the `Add` button' do
      before(:all) do
        within '.master-overlay-global-actions' do
          click_link 'Add collection to the current project'
        end
        wait_for_xhr
      end

      after(:all) do
        reset_project
      end

      it 'adds the collection to the current project' do
        expect(project_collection_ids).to match_array(['15 Minute Stream Flow Data: USGS (FIFE)'])
      end

      it 'shows the link to view the project' do
        expect(page).to have_link('My Project')
      end
    end

    context 'clicking on the `Remove` button' do
      context 'when the removed collection was the last one in the project' do
        before(:all) do
          within '.master-overlay-global-actions' do
            click_link 'Add collection to the current project'
            click_link 'Remove collection from the current project'
          end
        end

        after(:all) do
          reset_project
        end

        it 'hides the link to view the project' do
          expect(page).to have_no_link('My Project')
        end

        it 'removes the collection from the current project' do
          expect(project_collection_ids).to match_array([])
        end
      end
    end
  end
end
