require 'spec_helper'

describe 'Add to project', reset: false do
  context "in the granule results tab" do
    before :all do
      Capybara.reset_sessions!
      load_page :search
      fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
      wait_for_xhr
      first_collection_result.click
      wait_for_xhr
    end

    after :all do
      reset_project
    end


    it 'displays "Add" buttons for collections not in the current project' do
      within '.master-overlay-global-actions' do
        expect(page).to have_link("Add collection to the current project")
        expect(page).to have_no_link("Remove collection from the current project")
      end
    end

    it 'displays "Remove" buttons for collections not in the current project' do
      within '.master-overlay-global-actions' do
        click_link "Add collection to the current project"
        expect(page).to have_no_link("Add collection to the current project")
        expect(page).to have_link("Remove collection from the current project")
      end

      reset_project
    end

    context 'clicking on an "Add" button' do
      before(:all) do
        within '.master-overlay-global-actions' do
          click_link "Add collection to the current project"
          wait_for_xhr
        end
      end

      after(:all) do
        reset_project
      end

      it 'adds the collection to the current project' do
        expect(project_collection_ids).to match_array(['15 Minute Stream Flow Data: USGS (FIFE)'])
      end


    end

    context 'clicking on a "Remove" button' do
      context 'when the removed collection was the last one in the project' do
        before(:all) do
          within '.master-overlay-global-actions' do
            click_link "Add collection to the current project"
            click_link "Remove collection from the current project"
          end
        end

        after(:all) do
          reset_project
        end

        it 'removes the summary of the collections in the project' do
          expect(page).to have_no_text("You have 1 collection in your project.")
          expect(page).to have_text('Add collections to your project to compare and retrieve their data.')
        end

        it 'hides the link to view the project' do
          expect(page).to have_no_link("View Project")
        end

        it 'removes the collection from the current project' do
          expect(project_collection_ids).to match_array([])
        end
      end
    end


  end
end
