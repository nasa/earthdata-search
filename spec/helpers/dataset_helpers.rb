module Helpers
  module DatasetHelpers

    def use_dataset(id, text)
      before :all do
        fill_in "keywords", with: id
        expect(page).to have_content(text)
      end

      after :all do

        reset_search
        wait_for_xhr
      end
    end

    def hook_visualization
      before :all do
        first_dataset_result.click_link "View dataset"
      end

      after :all do
        first_dataset_result.click_link "Hide dataset"
      end
    end

    def hook_visualization_removal
      before :all do
        first_dataset_result.click_link "View dataset"
        wait_for_xhr
        first_dataset_result.click_link "Hide dataset"
      end
    end
  end
end
