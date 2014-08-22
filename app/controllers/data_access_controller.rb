require 'json'

class DataAccessController < ApplicationController
  include ActionView::Helpers::TextHelper
  respond_to :json

  def configure
  end

  def retrieve
    user = current_user
    unless user
      render file: 'public/401.html', status: :unauthorized
      return
    end

    project = JSON.parse(params[:project])
    project['datasets'].each do |dataset|
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

    retrieval = Retrieval.new
    retrieval.user = user
    retrieval.jsondata = project
    retrieval.save!

    redirect_to action: 'retrieval', id: retrieval.to_param
  end

  def retrieval
    @retrieval = Retrieval.find(params[:id].to_i)

    orders = @retrieval.jsondata['datasets'].map do |dataset|
      dataset['serviceOptions']['accessMethod'].select { |m| m['type'] == 'order' }
    end.flatten.compact

    if orders.size > 0
      order_ids = orders.map {|o| o['order_id']}
      order_response = Echo::Client.get_orders({id: order_ids}, token)
      if order_response.success?
        echo_orders = order_response.body.map {|o| o['order']}.index_by {|o| o['id']}

        orders.each do |order|
          echo_order = echo_orders[order['order_id']]
          if echo_order
            order['order_status'] = echo_order['state']
          end
        end
      end
    end

    user = current_user
    render file: "#{Rails.root}/public/401.html", status: :unauthorized unless user
    render file: "#{Rails.root}/public/403.html", status: :forbidden unless user == @retrieval.user
  end

  def status
    if current_user
      @retrievals = current_user.retrievals
    else
      render file: "#{Rails.root}/public/401.html"
    end
  end

  def remove
    if params[:order_id]
      order_response = Echo::Client.delete_order(params[:order_id], token)
      render json: order_response.body, status: order_response.status
    elsif params[:retrieval_id]
      retrieval = Retrieval.find(params[:retrieval_id])
      user = current_user
      render file: "#{Rails.root}/public/401.html", status: :unauthorized unless user
      render file: "#{Rails.root}/public/403.html", status: :forbidden unless user == retrieval.user

      retrieval.destroy
      redirect_to action: :status, status: :found
    end
  end

  # This rolls up getting information on data access into an API that approximates
  # what we'd like ECHO / CMR to support.
  def options
    granule_params = request.query_parameters.merge(page_size: 150, page_num: 1)
    catalog_response = Echo::Client.get_granules(granule_params, token)

    if catalog_response.success?
      dataset = Array.wrap(request.query_parameters[:echo_collection_id]).first
      if dataset
        dqs = Echo::Client.get_data_quality_summary(dataset, token)
      end

      access_config = AccessConfiguration.find_by(user: current_user, dataset_id: dataset)
      defaults = access_config.service_options if access_config

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
          dqs: dqs,
          size: size.round(1),
          sizeUnit: units.first,
          methods: get_downloadable_access_methods(dataset, granules, granule_params, hits) + get_order_access_methods(dataset, granules, hits),
          defaults: defaults
        }
      else
        result = {
          hits: 0,
          methods: [],
          defaults: defaults
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

  def get_downloadable_access_methods(dataset_id, granules, granule_params, hits)
    result = []
    downloadable = granules.select {|granule| granule['online_access_flag'] == 'true'}
    if downloadable.size > 0
      opendap_config = OpendapConfiguration.find(dataset_id)

      spatial = granule_params['bounding_box'] || granule_params['polygon'] || granule_params['point'] || granule_params['line']

      mbr = nil
      if spatial.present?
        latlngs = spatial.split(',').map(&:to_f).each_slice(2)
        lngs = latlngs.map(&:first)
        lats = latlngs.map(&:last)
        mbr = [lats.min, lngs.min, lats.max, lngs.max]
      end

      method = {
        name: 'Download',
        type: 'download',
        subset: opendap_config.formats.present?,
        parameters: opendap_config.parameters,
        spatial: mbr,
        formats: opendap_config.formats,
        all: downloadable.size == granules.size,
        count: (hits.to_f * downloadable.size / granules.size).round
      }
      result << method
    end
    result
  end

  def get_order_access_methods(dataset_id, granules, hits)
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
