require 'json'

class DataAccessController < ApplicationController
  respond_to :json

  def configure
    @project = JSON.parse(params[:project])
  end

  def retrieve
    @project = JSON.parse(params[:project])

    @project['datasets'].each do |dataset|
      params = Rack::Utils.parse_query(dataset['params'])
      params.merge!(page_size: 2000, page_num: 1)

      access_methods = dataset['serviceOptions']['accessMethod']
      access_methods.each do |method|
        if method['type'] == 'order'
          order_response = Echo::Client.create_order(params,
                                                     method['id'],
                                                     method['method'],
                                                     method['model'],
                                                     get_user_id,
                                                     token)
          method[:order_id] = order_response[:order_id]
        end
      end
    end
  end

  def data_download
    @ip = request.remote_ip
    # TODO: These could be dangerous
    @user_id = cookies['name']
    @query = request.env['QUERY_STRING']
  end

  # This rolls up getting information on data access into an API that approximates
  # what we'd like ECHO / CMR to support.
  def options
    granule_params = request.query_parameters.merge(page_size: 150, page_num: 1)
    catalog_response = Echo::Client.get_granules(granule_params, token)

    if catalog_response.success?
      granules = catalog_response.body['feed']['entry']

      result = {}
      if granules.size > 0

        hits = catalog_response.headers['echo-hits'].to_i

        sizeMB = granules.reduce(0) {|size, granule| size + granule['granule_size'].to_f}
        size = (1024 * 1024 * sizeMB / granules.size) * hits

        units = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes', 'Exabytes']
        while size > 1024 && units.size > 1
          size = size.to_f / 1024
          units.shift()
        end

        result = {
          hits: hits,
          size: size.round(1),
          sizeUnit: units.first,
          methods: get_downloadable_access_methods(granules, hits) + get_order_access_methods(granules, hits)
        }
      else
        result = {
          hits: 0,
          methods: []
        }
      end

      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end

      respond_with(result, status: catalog_response.status)
    else
      respond_with(catalog_response.body, status: catalog_response.status)
    end
  end

  private

  def get_downloadable_access_methods(granules, hits)
    result = []
    downloadable = granules.select {|granule| granule['online_access_flag'] == 'true'}
    if downloadable.size > 0
      result << {
        name: 'Download',
        type: 'download',
        all: downloadable.size == granules.size,
        count: (hits.to_f * downloadable.size / granules.size).round
      }
    end
    result
  end

  def get_order_access_methods(granules, hits)
    granule_ids = granules.map {|granule| granule['id']}
    order_info = Echo::Client.get_order_information(granule_ids, token).body

    defs = {}
    Array.wrap(order_info).each do |info|
      info = info['order_information']
      granule_id = info['catalog_item_ref']['id']

      Array.wrap(info['option_definition_refs']).each do |ref|
        option_id = ref['id']
        option_name = ref['name']

        defs[option_id] ||= {
          name: option_name,
          count: 0
        }
        defs[option_id][:count] += 1
      end
    end

    defs.map do |option_id, config|
      config[:id] = option_id
      config[:type] = 'order'
      config[:form] = Echo::Client.get_option_definition(option_id).body['option_definition']['form']
      config[:all] = config[:count] == granules.size
      config[:count] = (hits.to_f * config[:count] / granules.size).round
      config
    end
  end
end
