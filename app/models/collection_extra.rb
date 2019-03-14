class CollectionExtra < ActiveRecord::Base
  self.table_name = 'dataset_extras'

  validates_presence_of :echo_id
  validates_uniqueness_of :echo_id

  store :searchable_attributes, coder: JSON
  store :orbit, coder: JSON

  def self.build_echo_client(env = (@cmr_env || Rails.configuration.cmr_env))
    Rails.logger.debug "[#{Time.now}] Building echo client for env: #{env || 'env not working'}"
    Echo::Client.client_for_environment(env, Rails.configuration.services)
  end

  def self.create_system_token(client)
    response = client.create_token(ENV['system_user'], ENV['system_user_password'])
    if response.success? && response.body['token']
      response.body['token']['id']
    else
      Rails.logger.debug '[#{Time.now}] System token not created successfully'
      nil
    end
  end

  # Query CMRs collection search endpoint and insert umm-s details into `associations.service_objects`
  # for any ids present in the `associations.services`
  #
  # @param client [EchoClient] the client used to communicate with CMR
  # @param token [String] the token to supply to CMR
  # @param cmr_options [Hash] the parameters to provide to CMR
  # @return [Array] a list of collections with umm details inserted for services associated with each collection
  def self.get_collections_with_service_details(client, token, cmr_options = {})
    # Create two empty arrays that we'll populate below that will allow us to make
    # one large call to CMR to retrieve and insert full service responses into each collection
    services    = []
    collections = []

    # Search CMR for any collection with granules and include any tag that contains `subset_service` so that when
    # `add_extra_tag` is called it can check to see if the tag is already on the collection before attemtping to add it
    each_collection(client, cmr_options, token) do |collection|
      # Add the services associated with each collection
      services << collection.fetch('associations', {}).fetch('services', [])

      # Append to our array to prevent having to ping CMR again
      collections << collection
    end

    # Flatten the array and remove duplicates
    services.flatten!.compact!

    # Retreive details about each of the services associated with collections we care about
    page_size       = 1000
    page_num        = 1
    service_objects = []

    # Loop through paged cmr results until we've received all collections or an error occurs
    loop do
      service_response = client.get_services(page_size: page_size, page_num: page_num, concept_id: services)

      # If an error ocurrs we'll assume its not specific to a single page and break
      unless service_response.success?
        Rails.logger.error "Error retrieving services within `CollectionExtra.get_collections_with_service_details`: #{service_response.body}"

        break
      end

      page_results = service_response.body.fetch('items', [])

      # Append the results from this page to the overall results
      service_objects += page_results

      break if page_results.length < page_size

      page_num += 1
    end

    collections.each do |collection|
      # Look for any of the services associated with this collection in the list of all services
      # returned from our larger lookup
      collection.fetch('associations', {}).fetch('services', []).each do |collection_service_id|
        service_objects.each do |service_object|
          # Initialize an array to hold the service details
          collection['associations']['service_objects'] ||= []

          next unless collection_service_id == service_object['meta']['concept-id']

          # Add the full service object details into the collection metadeta
          collection['associations']['service_objects'] << service_object
        end
      end
    end
  end

  # Remove tags from collections that no longer support the provided subsetting
  #
  # @param tag_name [String] the tag to remove from collections without the `edsc.extra` prefix
  # @param collections [Array] the list of collections that are known to support the provided subsetting
  # @param client [EchoClient] the client used to communicate with CMR
  # @param token [String] the token to supply to CMR
  def self.remove_stale_tags(tag_name, collections, client, token)
    page_size = 2000
    page_num  = 1
    tagged_collections = []

    # Retrieve all collections on CMR that are tagged with the provided tag
    loop do
      response = client.get_collections({ page_size: page_size, page_num: page_num, tag_key: tag_key(tag_name) }, token)

      tagged_collections += response.body.fetch('feed', {}).fetch('entry', [])

      Rails.logger.error "Error retrieving collections within `CollectionExtra.remove_stale_tags`: #{response.body}" unless response.success?

      break if !response.success? || response.body.fetch('items', []).length < page_size

      page_num += 1
    end

    ids_no_longer_capable = tagged_collections.map { |collection| collection['id'] } - collections.map { |collection| collection['id'] }

    if ids_no_longer_capable.empty?
      Rails.logger.debug "No stale `#{tag_name}` tags found"
    else
      ids_no_longer_capable.each_slice(500) do |slice_of_collections|
        Rails.logger.debug "Attempting to remove #{slice_of_collections.count} stale `#{tag_name}` tags"
        client.bulk_remove_tag(tag_key(tag_name), slice_of_collections.map { |elem| { 'concept-id' => elem } }, token)
      end
    end
  end

  # Sync the subsetting tags for the provided tag and umm-s abilities
  #
  # @param tag_name [String] the tag to add to collections that support the provided subsetting abilities without the `edsc.extra` prefix
  # @param subsetting_abilities [Array] the list of types (defined in the UMM-S schema) that a collection would need to support to be deemed capable
  # @param collections [Array] the list of all collections being considered for the provided tag
  # @param client [EchoClient] the client used to communicate with CMR
  # @param token [String] the token to supply to CMR
  def self.sync_subsetting_tags(tag_name, subsetting_abilities, collections, client, token)
    Rails.logger.debug "[#{Time.now}] Starting sync of `#{tag_name}`"

    collections_with_subsetting_abilities = collections.select do |collection|
      collection.fetch('associations', {}).fetch('service_objects', []).any? { |service_object| Array.wrap(subsetting_abilities).flatten.include?(service_object['umm']['Type']) }
    end

    remove_stale_tags(tag_name, collections_with_subsetting_abilities, client, token)

    Rails.logger.debug "There are #{collections_with_subsetting_abilities.size} collections that should be tagged with `#{tag_name}`"

    collections_with_subsetting_abilities.each do |collection|
      services = collection.fetch('associations', {}).fetch('service_objects', []).select { |service_object| Array.wrap(subsetting_abilities).flatten.include?(service_object['umm']['Type']) }

      add_extra_tag(collection, tag_name, services.map { |umm_service| umm_service['meta']['concept-id'] }, client, token) if services.any?
    end

    Rails.logger.debug "[#{Time.now}] Finished syncing of `#{tag_name}`"
  end

  # Sync the gibs tags on collections that support gibs imagery
  #
  # @param client [EchoClient] the client used to communicate with CMR
  # @param token [String] the token to supply to CMR
  def self.sync_gibs(client, token)
    Rails.logger.debug "[#{Time.now}] Starting sync GIBS"
    GibsConfiguration.new.sync_tags!(tag_key('gibs'), client, token)
    Rails.logger.debug "[#{Time.now}] Finished adding GIBS tags"
  end

  # Sync the tags that are used within search
  def self.sync_tags
    client = build_echo_client

    # Creates a token that will be used to create/remove the tags when necessary
    token = create_system_token(client)
    tags = [
      'subset_service.opendap',
      'subset_service.esi',
      'gibs'
    ]

    # Creates the tags that we'll assocaite with collections, unless they already exist
    client.create_tags_if_needed(tags.map { |tag| tag_key(tag) }, token)

    collections = get_collections_with_service_details(client, token, has_granules: true, include_tags: tag_key('subset_service'))

    # OPeNDAP Tagging
    sync_subsetting_tags('subset_service.opendap', ['OPeNDAP'], collections, client, token) if ActiveRecord::Type::Boolean.new.type_cast_from_user(ENV.fetch('SYNC_OPENDAP_TAGS', 'true'))

    # ESI Tagging
    sync_subsetting_tags('subset_service.esi', ['ESI', 'ECHO ORDERS'], collections, client, token) if ActiveRecord::Type::Boolean.new.type_cast_from_user(ENV.fetch('SYNC_EGI_TAGS', 'true'))

    # GIBS Tagging
    sync_gibs(client, token) if ActiveRecord::Type::Boolean.new.type_cast_from_user(ENV.fetch('SYNC_GIBS_TAGS', 'true'))
  end

  def self.add_extra_tag(collection, key, value, client, token)
    key = tag_key(key)
    Rails.logger.debug "Adding `#{key}` to #{collection['id']}"
    client.add_tag(key, value, { condition: { concept_id: collection['id'] } }, token) unless has_tag(collection, key, value)
  end

  def self.remove_extra_tag(collection, key, value, client, token)
    key = tag_key(key)
    client.remove_tag(key, { condition: { concept_id: collection['id'] } }, token) if has_tag(collection, key, value)
  end

  def self.tag_key(tag)
    ns = Rails.configuration.cmr_tag_namespace
    namespaced = ['org.', 'gov.', ns].any? { |prefix| tag.start_with?(prefix) }
    namespaced ? tag : [ns, tag].join('.extra.')
  end

  def self.tag_value(collection, tag)
    tag = tag_key(tag)
    tags = collection['tags']
    result = nil
    if tags.is_a?(Hash)
      result = tags[tag] && tags[tag]['data']
    elsif tags.is_a?(Array)
      tagdot = "#{tag}."
      match = tags.find { |t| t.start_with?(tagdot) }
      result = match.gsub(/^#{tagdot}/, '') if match.present?
      result = true if !result.present? && tags.include?(tag)
    end
    result
  end

  def self.has_tag(collection, tag, value=nil)
    tag = tag_key(tag)
    tags = collection['tags']
    actual = tag_value(collection, tag)
    if tags.is_a?(Array) || !value.nil?
      (value.nil? && actual != nil) || (!value.nil? && actual == value)
    else
      !tags.nil? && !tags[tag].nil?
    end
  end

  def self.load
    echo_client = build_echo_client

    response = echo_client.get_provider_holdings
    results = response.body
    hits = response.headers['echo-dataset-hits'].to_i

    processed_count = 0

    results.each do |result|
      id = result['echo_collection_id']
      extra = CollectionExtra.find_or_create_by(echo_id: id)

      extra.has_granules = result['granule_count'].to_i > 0
      extra.has_browseable_granules = false unless extra.has_granules

      if extra.has_granules
        # Edited the condition to update browseable_granule ID if it hasn't been updated for a week.
        if extra.has_browseable_granules.nil? || (extra.has_browseable_granules && extra.updated_at < 1.week.ago)
          response = echo_client.get_granules(format: 'json',
                                              echo_collection_id: [id],
                                              page_size: 1, browse_only: true, sort_key: ['-start_date'])
          if response.success?
            browseable = response.body['feed']['entry']
            extra.has_browseable_granules = browseable.size > 0
            if extra.has_browseable_granules
              extra.granule = extra.browseable_granule = browseable.first['id']
            end
          else
            Rails.logger.debug response.body.to_json
          end
        end
        if extra.granule.nil?
          response = echo_client.get_granules(format: 'json',
                                              echo_collection_id: [id],
                                              page_size: 1)
          if response.success?
            granules = response.body['feed']['entry']
            extra.granule = granules.first['id'] if granules.first
          else
            Rails.logger.debug response.body.to_json
          end
        end
        Rails.logger.debug "[#{Time.now}] Provider has granules but no granules found: #{result['echo_collection_id']}" unless extra.granule
      end

      begin
        extra.save! if extra.changed?
      rescue ActiveRecord::RecordNotUnique => e
        Rails.logger.debug "[#{Time.now}] #{e.message}"
      end

      processed_count += 1

      Rails.logger.debug "[#{Time.now}] #{processed_count} / #{hits}"
    end
  end

  def self.load_echo10
    each_collection(build_echo_client, format: 'echo10') do |collection|
      extra = CollectionExtra.find_or_create_by(echo_id: collection['concept_id'])
      collection = collection['Collection']

      # Additional attribute definitions
      attribute_defs = collection['AdditionalAttributes'] || {}
      attributes = Array.wrap(attribute_defs['AdditionalAttribute']).reject { |a| a['Value'] }
      if attributes.present?
        attributes = attributes.map do |attr|
          attr.map { |k, v| { k.underscore => v } }.reduce(&:merge)
        end
        extra.searchable_attributes = { attributes: attributes }
      else
        extra.searchable_attributes = { attributes: [] }
      end

      # Orbit parameters
      spatial = collection['Spatial'] || {}
      orbit = spatial['OrbitParameters']
      if orbit
        orbit = orbit.map { |k, v| { k.underscore => v } }.reduce(&:merge)
        extra.orbit = orbit
      else
        extra.orbit = {}
      end

      extra.save if extra.changed?
    end

    nil
  end

  def self.each_collection(echo_client, extra_params = {}, token = nil)
    params = { page_num: 0, page_size: 2000 }
    processed_count = 0

    start = Time.now
    loop do
      params[:page_num] += 1
      response = echo_client.get_collections(params.merge(extra_params), token)
      body = response.body
      collections = if body['results']
                      # ECHO10
                      rray.wrap(body['results']['result'])
                    elsif body['feed']
                      # Atom
                      body['feed']['entry']
                    else
                      []
                    end

      hits = response.headers['cmr-hits'].to_i

      collections.each do |collection|
        yield collection
        processed_count += 1
      end
      Rails.logger.debug "[#{Time.now}] #{processed_count} / #{hits} Collections Processed"

      break unless processed_count < hits && !collections.empty?
    end

    Rails.logger.debug "[#{Time.now}] #{processed_count} Collections Processed in #{Time.now - start}s"

    nil
  end

  def self.decorate_all(collections)
    ids = collections.map { |r| r['id'] }
    extras = CollectionExtra.where(echo_id: ids).index_by(&:echo_id)

    collections.map! do |result|
      extra = extras[result['id']] || CollectionExtra.new
      extra.decorate(result)
    end
  end

  def decorate(collection)
    collection = collection.dup.with_indifferent_access

    decorate_browseable_granule(collection)
    decorate_granule_information(collection)
    decorate_opendap_layers(collection)
    decorate_echo10_attributes(collection)
    decorate_modaps_layers(collection)
    decorate_tag_mappings(collection)

    collection[:links] = Array.wrap(collection[:links]) # Ensure links attribute is present

    collection
  end

  def clean_attributes
    @clean_attrs ||= Array.wrap((searchable_attributes || {})['attributes']).map do |attr|
      attr = attr.dup
      # Delete useless garbage
      name = attr['name']
      description = attr['description']
      if description.present? &&
          (description == 'None' ||
          description == name ||
          description.start_with?("The #{name} for this collection") ||
          description.start_with?("The #{name} attribute for this granule"))

        attr.delete('description')
      end

      attr['data_type'] = 'STRING' if attr['data_type'].include?('STRING')

      renames = {
        'data_type' => 'type',
        'parameter_units_of_measure' => 'unit',
        'parameter_range_begin' => 'begin',
        'parameter_range_end' => 'end'
      }

      renames.each do |from, to|
        value = attr.delete(from)
        attr[to] = value if value
      end

      type_to_name = {
        'INT' => 'Integer',
        'FLOAT' => 'Float',
        'DATETIME' => 'Date/Time',
        'TIME' => 'Time',
        'DATE' => 'Date',
        'STRING' => 'String value'
      }

      help = type_to_name[attr['type']] || attr['type']
      help += " #{attr['unit']}" if attr['unit']

      if attr['begin'] && attr['end']
        help += " from #{attr['begin']} to #{attr['end']}"
      elsif attr['begin']
        help += ", minimum: #{attr['begin']}"
      elsif attr['end']
        help += ", maximum: #{attr['end']}"
      end
      help += ", ranges allowed" unless attr['type'] == 'STRING'
      attr['help'] = help

      if ['INT', 'FLOAT'].include?(attr['type'])
        attr['begin'] = attr['begin'].to_f if attr['begin']
        attr['end'] = attr['end'].to_f if attr['end']
      end

      attr
    end
    @clean_attrs.presence
  end

  private

  def decorate_tag_mappings(collection)
    ns = Rails.configuration.cmr_tag_namespace

    if self.class.has_tag(collection, 'org.ceos.wgiss.cwic.granules.prod') && !collection[:has_granules]
      ds_tag = "#{ns}.datasource"
      renderers_tag = "#{ns}.renderers"
      collection[:tags][ds_tag] = {data: 'cwic'} unless self.class.has_tag(collection, ds_tag)
      collection[:tags][renderers_tag] = {data: ['cwic']} unless self.class.has_tag(collection, renderers_tag)
    end
  end

  def decorate_echo10_attributes(collection)
    collection[:searchable_attributes] = self.clean_attributes
    collection[:orbit] = self.orbit if self.orbit.present?
  end

  def decorate_browseable_granule(collection)
    collection[:browseable_granule] = self.browseable_granule
  end

  def decorate_granule_information(collection)
    collection[:has_granules] = self.has_granules unless collection.key?(:has_granules)
  end

  def decorate_opendap_layers(collection)
    # Note: this is now decoupled from the tag. Collections can have opendap endpoints
    # in their metadata surfaced this way without getting the badge
    # TODO: Once we can remove the legacy config, this can be done in Javascript
    collection[:opendap_url] = OpendapConfiguration.opendap_root(collection)
    collection[:opendap] = self.class.has_tag(collection, 'subset_service.opendap') || self.class.has_tag(collection, 'subset_service.esi')
  end

  def decorate_modaps_layers(collection)
    collection[:modaps] = false
    modaps_config = Rails.configuration.services['modaps'][collection['id']]
    if modaps_config.present?
      collection[:modaps] = Hash.new
      collection[:modaps][:get_capabilities] =  "http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/#{collection[:short_name]}/getCapabilities?service=WCS&version=1.0.0&request=GetCapabilities"
    end
  end
end
