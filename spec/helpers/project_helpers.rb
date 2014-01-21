module Helpers
  module ProjectHelpers

    def reset_project
      page.evaluate_script('edsc.models.page.current.project.datasets([])')
      page.evaluate_script('edsc.models.page.current.project.datasets()') # Read it back out to ensure it was applied
    end

    def project_dataset_ids
      page.evaluate_script('edsc.models.page.current.project.datasets().map(function(ds){return ds.dataset_id();})')
    end
  end
end
