module Helpers
  module CollectionHelpers
    def use_collection(id)
      before :all do
        dismiss_banner
        wait_for_xhr
        fill_in 'keywords', with: id
        wait_for_xhr
      end

      after :all do
        reset_search
        wait_for_xhr
      end
    end

    def view_granule_results(col_name = '15 Minute Stream Flow Data: USGS (FIFE)', from = 'collection-results')
      wait_for_xhr
      root = from
      root = 'collection-results-list' if root == 'collection-results'

      # Execute with Ruby
      page.find("##{root} .panel-list-item", text: col_name).click

      # item.click # This causes intermittent failures based on timing
      wait_for_xhr
    rescue StandardError => e
      Capybara::Screenshot.screenshot_and_save_page
      puts "Visible overlay: #{OverlayUtil.current_overlay_id(page)}"
      raise e
    end

    def leave_granule_results
      wait_for_xhr
      page.find('#granule-list a.master-overlay-back').click
      wait_for_xhr
    rescue StandardError => e
      Capybara::Screenshot.screenshot_and_save_page
      puts "Visible overlay: #{OverlayUtil.current_overlay_id(page)}"
      raise e
    end

    def hook_granule_results(col_name = '15 Minute Stream Flow Data: USGS (FIFE)', scope = :all, from = 'collection-results')
      before(scope) { view_granule_results(col_name, from) }
      after(scope) { leave_granule_results }
    end

    def hook_granule_results_back(col_name = '15 Minute Stream Flow Data: USGS (FIFE)')
      before :all do
        view_granule_results(col_name)
        leave_granule_results
      end
    end

    def search_results_granule_count
      page.find('.master-overlay-info-panel.master-overlay-global-actions.actions')
    end
  end
end
