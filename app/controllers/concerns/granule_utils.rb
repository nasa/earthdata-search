module GranuleUtils
  extend ActiveSupport::Concern

  protected

  def granule_params_for_request(request, timeline = false)
    params = request.request_parameters.dup

    if params['cloud_cover']
      min = params['cloud_cover']['min'] || ''
      max = params['cloud_cover']['max'] || ''
      params['cloud_cover'] = min + ',' + max

      params.delete('cloud_cover') if min.empty? && max.empty?
    end

    params.delete('variables') if params['variables']
    params.delete('datasource') if params['datasource']
    params.delete('short_name') if params['short_name']

    override_temporal = params.delete('override_temporal')
    params['temporal'] = override_temporal if !timeline && override_temporal

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
      # TODO: other 'translations' here
    end
  end

  # Provided a project and specific collection from the project this method will
  # ping OUS to retrieve links to the granules from the appropriate OPeNDAP server
  def fetch_ous_response(options)
    # When a user clicks 'Download Data' the app serializes the project and stores it in
    # the database as a Retrieval object, we'll retreive that here to extract the details
    project = Retrieval.find(options[:project])

    # Parse the query params of the project url into a ruby hash
    project_params = Rack::Utils.parse_nested_query(project.jsondata['query'])

    # The `p` param reserves a space for the focused collection in position 0, if the collection
    # we're requesting happens to be the focused collection it will return 0 as the collection_index
    # below which isn't how the index is set when providing collection specific values in the url.
    # This strips the leading value ignoring the focused collection and we'll add 1 to our index
    # after we find the requested collection below
    collection_ids_without_focused = project_params['p'].split('!', 2).last

    # Get the location of the collection in the collections list
    project_collection_ids = collection_ids_without_focused.split('!')

    # Search for the requested collection in the project collection string
    collection_index = project_collection_ids.index(options[:collection])

    # Adjust the collection_index for the focused collection id
    collection_index += 1

    # Retrieve the variable concept ids, if any exist
    collection_variables = project_params.fetch('pg', {}).fetch(collection_index.to_s, {})['variables'] if collection_index

    # Default payload to send to OUS
    ous_params = {}

    ous_params['variables']    = collection_variables.split('!')   if collection_variables
    ous_params['bounding_box'] = project_params['bounding_box'] if project_params.key?('bounding_box')
    ous_params['temporal']     = project_params['temporal'] if project_params.key?('temporal')

    puts ous_params
    excluded_granules = project_params.fetch('pg', {}).fetch(collection_index.to_s, {}).fetch('exclude', {}).fetch('echo_granule_id', [])

    if excluded_granules.any?
      ous_params['exclude-granules'] = true
      ous_params['granules'] = excluded_granules
    end

    ous_client.get_coverage(options[:collection], ous_params, token).body
  end
end
