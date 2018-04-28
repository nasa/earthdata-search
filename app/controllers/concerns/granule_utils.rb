module GranuleUtils
  extend ActiveSupport::Concern

  protected

  def granule_params_for_request(request)
    params = request.request_parameters.dup

    if params["cloud_cover"]
      min = params["cloud_cover"]["min"] || ''
      max = params["cloud_cover"]["max"] || ''
      params["cloud_cover"] = min + ',' + max

      params.delete('cloud_cover') if min.empty? && max.empty?
    end

    params.delete('variables') if params['variables']
    params.delete('datasource') if params['datasource']
    params.delete('short_name') if params['short_name']

    params
  end

  def decorate_cwic_granules(response)
    Array.wrap(response.body['feed']['entry']).each do |cwic_granule|
      # decorate CWIC granules to make them look like CMR granules
      # Rename 'link' to 'links'
      cwic_granule['links'] = cwic_granule.delete('link')
      # Initialize browse_flag
      cwic_granule['browse_flag'] = false
      cwic_granule['links'].each do |link|
        if link['rel'] == 'icon'
          cwic_granule['browse_flag'] = true
          break
        end
      end
      #TODO other 'translations' here
    end
  end

  # Provided a project and specific collection from the project this method will
  # ping OUS to retrieve links to the granules from the appropriate OPeNDAP server
  def fetch_ous_response(options)
    project = Retrieval.find(options[:project])
    project_params = Rack::Utils.parse_nested_query(project.jsondata['query'])

    # Get the location of the collection in the collections list
    collection_index = project_params['p'].split('!').index(options[:collection])

    # Retrieve the variable concept ids, if any exist
    collection_variables = project_params.fetch('pg', {}).fetch(collection_index.to_s, {})['variables'] if collection_index

    # OUS expects Variable names, so we'll retrieve them from CMR
    variable_names = variable_names({ cmr_format: 'umm_json', concept_id: collection_variables.split('!') }, token).join(',') if collection_variables

    # Filter out granules that have been excluded by supported opendap subsetting
    granules_params = {
      'echo_collection_id' => options[:collection]
    }.merge(project_params.select { |param| %w(temporal bounding_box).include?(param) })

    granules_response = echo_client.get_granules(granules_params, token)

    return [] unless granules_response.success?

    granule_ids = granules_response.body.fetch('feed', {}).fetch('entry', {}).map { |g| g['id'] }

    # Now that we have the granules that we're looking for, we'll construct the
    # payload to send to OUS
    ous_params = {
      'coverage' => granule_ids.join(',')
    }

    # Spatial subsetting is used to subset variables, so we'll only concern ourselves
    # with spatial subsetting if variables are provided. Additionally OPeNDAP only
    # supports bounding boxes for spatial subsetting
    if collection_variables
      ous_params['RangeSubset'] = variable_names

      if granules_params.key?('bounding_box') && granules_params['bounding_box']
        bb = granules_params['bounding_box'].split(',')

        # WCS requires that this key be the same so we're adding it as an array
        # and within the OUS Client we've configured Faraday to use `FlatParamsEncoder`
        # that will prevent the addition of `[]` at the end of the keys in the url
        ous_params['subset'] = ["lat(#{bb[1]},#{bb[3]})", "lon(#{bb[0]},#{bb[2]})"]
      end
    end

    ous_client.get_coverage(ous_params).body
  end
end
