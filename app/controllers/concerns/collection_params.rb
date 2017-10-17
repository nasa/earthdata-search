module CollectionParams
  extend ActiveSupport::Concern

  protected

  def collection_params_for_request(request)
    params = request.query_parameters.dup

    params.delete(:portal)
    if portal? && portal[:params]
      params.deep_merge!(portal[:params]) do |key, v1, v2|
        if v1.is_a?(Array) && v2.is_a?(Array)
          v1 + v2
        else
          v2
        end
      end
    end

    test_facets = params.delete(:test_facets)
    if Rails.env.test? && !test_facets
      params = params.except('include_facets')
    end

    features = Hash[Array.wrap(params.delete(:features)).map {|f| [f, true]}]
    if features['Subsetting Services']
      params['tag_key'] = Array.wrap(params['tag_key'])
      params['tag_key'] << "#{Rails.configuration.cmr_tag_namespace}.extra.subset_service*"
    end

    if features['Map Imagery']
      params['tag_key'] = Array.wrap(params['tag_key'])
      params['tag_key'] << "#{Rails.configuration.cmr_tag_namespace}.extra.gibs"
    end

    if features['Near Real Time']
      params = params.merge('collection_data_type' => 'NEAR_REAL_TIME')
    end

    params['include_tags'] = ["#{Rails.configuration.cmr_tag_namespace}.*",
                              "org.ceos.wgiss.cwic.granules.prod"].join(',')

    # params['include_facets'] = 'v2'

    relevancy_param(params)

    if params['all_collections'].nil? || params['all_collections'].present? && params.delete('all_collections').to_s != 'true'
      params['has_granules'] = true
    end

    params['two_d_coordinate_system'].delete 'coordinates' if params['two_d_coordinate_system'].present?

    params['options[temporal][limit_to_granules]'] = true

    params
  end

  # When a collection search has one of these fields:
  #   keyword
  #   platform
  #   instrument
  #   sensor
  #   two_d_coordinate_system_name
  #   science_keywords
  #   project
  #   processing_level_id
  #   data_center
  #   archive_center
  # We should sort collection results by: sort_key[]=has_granules&sort_key[]=score
  # Otherwise, we should sort collection results by: sort_key[]=has_granules&sort_key[]=entry_title
  def relevancy_param(params)
    params[:sort_key] = ['has_granules']
    # sensor, archive_center and two_d_coordinate_system_name were removed from the available facets but it doesn't
    # hurt to list them here though.
    relevancy_capable_fields = [:keyword, :free_text, :platform, :instrument, :sensor, :two_d_coordinate_system_name,
                                :science_keywords, :project, :processing_level_id, :data_center, :archive_center]
    params[:sort_key].push 'score' unless (params.keys & relevancy_capable_fields.map(&:to_s)).empty?
  end
end