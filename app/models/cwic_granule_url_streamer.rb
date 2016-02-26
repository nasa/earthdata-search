class CwicGranuleUrlStreamer < GranuleUrlStreamer
  def initialize(params, token, url_mapper, echo_client, url_type=:download)
    super
    @short_name = params['short_name']
    @temporal = params['temporal']
  end

  def each
    yielded_info = false
    at_end = false
    page = 1
    page_size = @params["page_size"]
    until at_end
      if @params['echo_granule_id']
        catalog_response = @echo_client.get_cwic_granule(@params['echo_granule_id'])
      else
        page_size = 200 # Max page_size for CWIC requests is 200.
        catalog_response = @echo_client.get_cwic_granules(@short_name, page, page_size, @temporal)
      end
      hits = catalog_response.body['feed']['totalResults'].to_i if catalog_response.success?


      if catalog_response.success?
        granules = Array.wrap(catalog_response.body['feed']['entry'])
        at_end = page_size * page >= hits

        granules.each do |granule|
          unless yielded_info
            @url_mapper.info_urls_for(granule).each do |url|
              yield url
            end
            yielded_info = true
          end

          @url_mapper.send("#{@url_type}_urls_for", granule).each do |url|
            yield url
          end
        end

        page += 1
      else
        @errors = catalog_response.body
        return
      end
    end
  end
end