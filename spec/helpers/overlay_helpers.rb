module Helpers
  module OverlayHelpers
    def reset_overlay
      page.execute_script """
        overlay = $('.master-overlay')
        overlay.masterOverlay('level', 0)
        overlay.masterOverlay('show')
        overlay.masterOverlay('showParent')
        overlay.masterOverlay('hideSecondary')
      """
    end

    def reset_visible_collections
      page.evaluate_script("""
        var i, len, visible = edsc.models.data.Collection.visible();
        for (i = 0, len = visible.length; i < len; i++) {
          visible[i].visible(false);
        }
        edsc.models.page.current.collections.allCollectionsVisible(false)
        null
      """)
    end

    def have_visible_facets
      have_css('.is-master-overlay-parent-hidden')
    end

    def collection_results
      page.find('#collection-results')
    end

    def collection_results_header
      page.find('#collection-results header h2')
    end

    def unfeatured_collection_results
      page.find('#collection-results-list')
    end

    def featured_collection_results
      page.find('#collection-featured-list')
    end

    def featured_collapsed_collection_results
      page.find('#coll-collection-featured-list')
    end

    def unfeatured_collapsed_collection_results
      page.find('#coll-collection-results-list')
    end

    def first_featured_collection
      nth_panel(featured_collection_results, 1)
    end

    def second_featured_collection
      nth_panel(featured_collection_results, 2)
    end

    def first_collapsed_featured_collection
      nth_ccol(featured_collapsed_collection_results, 1)
    end

    def first_collapsed_collection
      nth_ccol(unfeatured_collapsed_collection_results, 1)
    end

    def first_collection_result
      nth_panel(unfeatured_collection_results, 1)
    end

    def second_collection_result
      nth_panel(unfeatured_collection_results, 2)
    end

    def third_collection_result
      nth_panel(unfeatured_collection_results, 3)
    end

    def nth_collection_result(n)
      nth_panel(unfeatured_collection_results, n)
    end

    def target_collection_result(col_name='15 Minute Stream Flow Data: USGS (FIFE)')
      page.find("#collection-results-list .panel-list-item", text: col_name)
    end

    def collection_details
      page.find('#collection-details')
    end

    def granule_details
      page.find('#granule-details')
    end

    def project_overview
      page.find('#project-overview')
    end

    def first_project_collection
      nth_panel(project_overview, 1)
    end

    def second_project_collection
      nth_panel(project_overview, 2)
    end

    def nth_project_collection(n)
      nth_panel(project_overview, n)
    end

    def granule_list
      page.find('#granule-list')
    end

    def first_granule_list_item
      nth_panel(granule_list, 1)
    end

    def second_granule_list_item
      nth_panel(granule_list, 2)
    end

    def third_granule_list_item
      nth_panel(granule_list, 3)
    end

    def nth_granule_list_item(n)
      nth_panel(granule_list, n)
    end

    def modal_body
      page.find('.modal-body')
    end

    def modal_footer
      page.find('.modal-footer')
    end

    private

    def nth_panel(root, n)
      root.find(".panel-list-item:nth-child(#{n})")
    end

    def nth_ccol(root, n)
      root.find(".ccol:nth-child(#{n})")
    end

    def manual_close_facet_list
      synchronize do
        page.find('#master-overlay-parent a.master-overlay-close').click
      end
    end
  end
end
