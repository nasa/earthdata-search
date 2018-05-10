module Ous
  class OusClient < BaseClient
    def get_coverage(collection_id, params, token)
      default_params = {
        format: 'nc'
      }

      get("collection/#{collection_id}", default_params.merge(params), token_header(token))
    end
  end
end
