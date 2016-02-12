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
end
