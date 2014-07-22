module Helpers
  module ProjectHelpers

    def add_dataset_to_project(id, name)
      wait_for_xhr
      fill_in "keywords", with: id
      wait_for_xhr
      expect(page).to have_content(name)
      expect(page).to have_css('#dataset-results .panel-list-item', count: 1)
      first_dataset_result.click_link "Add dataset to the current project"
    end

    def reset_project
      page.execute_script('edsc.models.page.current.project.datasets([])')
      page.execute_script('edsc.models.page.current.project.datasets()') # Read it back out to ensure it was applied
      page.execute_script('edsc.models.page.current.project.searchGranulesDataset(null)')
    end

    def project_dataset_ids
      page.evaluate_script('edsc.models.page.current.project.datasets().map(function(ds){return ds.dataset_id;})')
    end

    def click_save_project_name
      page.execute_script('$(".save-workspace-name").click()')
      wait_for_xhr
    end
  end
end
