require 'json'
require 'digest/sha1'

class DataAccessController < ApplicationController
  include ActionView::Helpers::TextHelper
  include GranuleUtils

  respond_to :json

  before_filter :require_login
  prepend_before_filter :metric_retrieval, only: [:configure]

  # This is a before filter to detect users lost to URS
  def metric_retrieval
    metrics_event('retrieve', {step: 'pre-configure'})
    collections = params[:p]
    if collections.present?
      collections = collections.split('!').map(&:presence).compact
      metrics_event('access', {collections: collections})
    end
  end

  def configure
    metrics_event('retrieve', {step: 'configure'})
    @back_path = request.query_parameters['back']
    if !@back_path || ! %r{^/[\w/]*$}.match(@back_path)
      @back_path = '/search/collections'
    end

    #This block removes the granule filter per EDSC-1214
    @paramsWithoutGranuleFilter = request.query_string
    params = CGI.parse(@paramsWithoutGranuleFilter)
    params.delete('sgd')
    @paramsWithoutGranuleFilter = URI.encode_www_form(params).to_s
    @paramsWithoutGranuleFilter = URI.unescape(@paramsWithoutGranuleFilter)
  end

  def retrieve
    # TODO PQ EDSC-1039: Store portal information here
    user = current_user
    unless user
      render file: 'public/401.html', status: :unauthorized
      return
    end

    metrics_event('retrieve', {step: 'complete'})

    project = JSON.parse(params[:project])

    retrieval = Retrieval.new
    retrieval.user = user
    retrieval.project = project
    retrieval.save!
    
    new_job = Retrieval.delay(:queue => retrieval.determine_queue).process(retrieval.id, token, cmr_env, edsc_path(request.base_url + '/'), session[:access_token])
    Rails.logger.info("Delayed Job " + new_job.id.to_s + " has been sent into queue " + new_job.queue.to_s + " with:" + params[:project]) 
    redirect_to edsc_path("/data/retrieve/#{retrieval.to_param}")
  end

  def retrieval
    # TODO PQ EDSC-1039: Include portal information here
    Rails.logger.info "Retrieving order status information for Retrieval Object ##{params[:id]}"

    id = Retrieval.deobfuscate_id(params[:id].to_i)
    @retrieval = Retrieval.find_by_id id

    render file: "#{Rails.root}/public/404.html", status: :not_found and return if @retrieval.nil?

    user = current_user
    render file: "#{Rails.root}/public/401.html", status: :unauthorized  and return unless user
    render file: "#{Rails.root}/public/403.html", status: :forbidden and return unless user == @retrieval.user

    # Ignore this for ajax requests and purposfully place it after the
    # check for ownership, we don't want randos causing jobs to be created
    unless params[:format] == 'json' || Rails.env.test?
      # Check the database for any jobs that exist to create this order
      processing_job = DelayedJob.where("handler LIKE '%method_name: :process%'")
                                 .where("handler LIKE '%args:\n- #{id.to_i}%'")
                                 .where(failed_at: nil)

      # Check the database for any jobs that exist to refresh this orders data
      retrieval_jobs = DelayedJob.where("handler LIKE '%method_name: :hydrate_jsondata%'")
                                 .where("handler LIKE '%args:\n- #{id.to_i}%'")
                                 .where(failed_at: nil)

      # If there are no jobs scheduled for this order and its not
      # already complete create a new one to retrieve new data
      if processing_job.empty? && retrieval_jobs.empty? && @retrieval.in_progress
        Rails.logger.info "Queueing up a new job to retrieve order status information for Retrieval ##{id.to_i}"
        
        Retrieval.delay(queue: @retrieval.determine_queue).hydrate_jsondata(id.to_i, token, cmr_env)
      end
    end

    respond_to do |format|
      format.html
      format.json { render json: @retrieval.project.merge(id: @retrieval.to_param).to_json }
    end
  end

  def status
    # TODO PQ EDSC-1039: Include portal information here
    if current_user
      @retrievals = current_user.retrievals
    else
      render file: "#{Rails.root}/public/401.html"
    end
  end

  def remove
    if params[:order_id]
      order_response = echo_client.delete_order(params[:order_id], token)
      render json: order_response.body, status: order_response.status
    elsif params[:retrieval_id]
      retrieval = Retrieval.find(params[:retrieval_id])
      user = current_user
      render file: "#{Rails.root}/public/401.html", status: :unauthorized and return unless user
      render file: "#{Rails.root}/public/403.html", status: :forbidden and return unless user == retrieval.user

      retrieval.destroy
      redirect_to action: :status, status: :found
    end
  end

  # This rolls up getting information on data access into an API that approximates
  # what we'd like ECHO / CMR to support.
  def options
    granule_params = request.request_parameters
    catalog_response = echo_client.get_granules(granule_params_for_request(request), token)

    if catalog_response.success?
      collection = Array.wrap(granule_params[:echo_collection_id]).first
      if collection
        dqs = echo_client.get_data_quality_summary(collection, token)
      end

      defaults = AccessConfiguration.get_default_access_config(current_user, collection)

      granules = catalog_response.body['feed']['entry']

      result = {}
      if granules.size > 0
        hits = catalog_response.headers['cmr-hits'].to_i

        sizeMB = granules.reduce(0) { |size, granule| size + granule['granule_size'].to_f }
        size = (1024 * 1024 * sizeMB / granules.size) * hits

        units = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes', 'Exabytes']
        while size > 1024 && units.size > 1
          size = size.to_f / 1024
          units.shift
        end

        methods = get_downloadable_access_methods(collection, granules, granule_params, hits) + get_order_access_methods(collection, granules, hits) + get_service_access_methods(collection, granules, hits)

        defaults = { service_options: nil } if echo_form_outdated?(defaults, methods)

        # If there are no defaults (no AccessConfigurations) and only 1 accessMethod,
        # then set the default to that access method. NOTE: If there are defaults then
        # the `defaults` variable will be an AccessConfigration, if there are no defaults
        # it is a Hash.
        if methods.length == 1 && (defaults.is_a?(Hash) && defaults.compact.blank?)
          only_method = methods[0]

          # When a collection as been previously ordered we store the information the
          # user selected in an AccessConfiguration object, since we don't have all of
          # that information at this point we'll just set the necessary values for the
          # UI to load correctly and select the only option avaialble.
          defaults[:service_options] = {
            accessMethod: [{
              method: only_method[:name],
              type: only_method[:type],
              id: only_method[:id]
            }]
          }
        end

        result = {
          hits: hits,
          dqs: dqs,
          size: size.round(1),
          sizeUnit: units.first,
          methods: methods,
          defaults: defaults[:service_options]
        }
      else
        result = {
          hits: 0,
          methods: [],
          defaults: defaults.nil? ? nil : defaults[:service_options]
        }
      end

      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('cmr-')
      end

      respond_with(result, status: catalog_response.status, location: nil)
    else
      respond_with(catalog_response.body, status: catalog_response.status, location: nil)
    end
  end

  private

  # forms in methods are fresh, latest ones.
  # The digest in access_config may be dirty.
  def echo_form_outdated?(access_config, methods)
    return true if access_config.nil? || access_config.echoform_digest.nil? || methods.nil?

    form_digest = []
    echoform_digest = access_config.echoform_digest
    echoform_digest = JSON.parse(echoform_digest) if echoform_digest.is_a? String
    methods.each do |method|
      if method[:type] == 'download' || method[:form].nil?
        digest = echoform_digest.select {|digest| digest['id'] == method[:type]}
      else
        digest = echoform_digest.select {|digest| digest['id'] == method[:id] && digest['form_hash'] == Digest::SHA1.hexdigest(method[:form])}
      end
      form_digest.push digest if digest.present?
    end

    return true if form_digest.empty?
    false
  end

  def get_downloadable_access_methods(collection_id, granules, granule_params, hits)
    result = []
    opendap_config = OpendapConfiguration.find(collection_id, echo_client, token) if collection_id.present?
    Rails.logger.info("opendap_config.inspect: #{opendap_config.inspect}")
    unless opendap_config
      opendap_config = OpendapConfiguration.new(collection_id)
    end
    if opendap_config.formats.present?
      downloadable = granules
    else
      downloadable = granules.select {|granule| granule['online_access_flag'] == 'true' || granule['online_access_flag'] == true}
    end
    if downloadable.size > 0
      spatial = granule_params['bounding_box'] || granule_params['polygon'] || granule_params['point'] || granule_params['line']

      mbr = nil
      if spatial.present?
        latlngs = spatial.split(',').map(&:to_f).each_slice(2)
        lngs = latlngs.map(&:first)
        lats = latlngs.map(&:last)
        mbr = [lats.min, lngs.min, lats.max, lngs.max]
      end

      method = {
        collection_id: collection_id,
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

  def get_order_access_methods(collection_id, granules, hits)
    granule_ids = granules.map {|granule| granule['id']}
    order_info = echo_client.get_order_information(granule_ids, token).body
    orderable_count = 0 #order_info['order_information']['orderable']

    defs = {}
    Array.wrap(order_info).each do |info|
      info = info['order_information']
      granule_id = info['catalog_item_ref']['id']
      orderable_count += 1 if info['orderable']

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

    defs = defs.map do |option_id, config|
      option_def = echo_client.get_option_definition(option_id, token).body['option_definition']
      if option_def['deprecated']
        config = nil
      else
        config[:collection_id] = collection_id
        config[:id] = option_id
        config[:type] = 'order'
        config[:form] = option_def['form']
        config[:form_hash] = Digest::SHA1.hexdigest(option_def['form'])
        config[:all] = config[:count] == granules.size
        config[:count] = (hits.to_f * config[:count] / granules.size).round
      end
      config
    end.compact

    # If no order options exist, still place an order
    if defs.size == 0 && orderable_count > 0
      config = {}
      config[:collection_id] = collection_id
      config[:id] = nil
      config[:name] = 'Order'
      config[:type] = 'order'
      config[:form] = nil
      config[:form_hash] = nil
      config[:all] = orderable_count == granules.size
      config[:count] = (hits.to_f * orderable_count / granules.size).round
      defs = [config]
    end

    defs
  end

  def get_service_access_methods(collection_id, granules, hits)
    service_order_info = echo_client.get_service_order_information(collection_id, token).body

    service_order_info.map do |info|
      option_id = info['service_option_assignment']['service_option_definition_id']

      option_def = echo_client.get_service_option_definition(option_id, token).body['service_option_definition']
      form = option_def['form']
      name = option_def['name']

      config = {}
      config[:collection_id] = collection_id
      config[:id] = option_id
      config[:type] = 'service'
      config[:form] = form
      config[:form_hash] = Digest::SHA1.hexdigest(form)
      config[:name] = name
      config[:count] = granules.size
      config[:all] = true
      config
    end
  end
end
