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

    # Default payload to send to OUS
    ous_params = {}

    ous_params['variables'] = collection_variables.split('!')   if collection_variables
    ous_params['bounding_box'] = project_params['bounding_box'] if project_params.key?('bounding_box')

    ous_client.get_coverage(options[:collection], ous_params, token).body
  end
end
