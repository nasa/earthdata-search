class CmrGranuleUrlStreamer < GranuleUrlStreamer
  def each
    yielded_info = false
    at_end = false
    page = 1
    page_size = @params["page_size"]
    until at_end
      catalog_response = @echo_client.get_granules(@params.merge(page_num: page), @token)
      hits = catalog_response.headers['CMR-Hits'].to_i

      if catalog_response.success?
        granules = catalog_response.body['feed']['entry']
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