class RetrievalCollection < ActiveRecord::Base
  belongs_to :retrieval

  store :collection_metadata, coder: JSON
  store :access_method,       coder: JSON
  store :granule_params,      coder: JSON

  # TODO: Move to a background process, this will block if called from the UI
  after_create :set_collection_metadata
  after_create :set_granule_count

  DEFAULT_MAX_ORDER_SIZE     = 1_000_000  # The largest order that EDSC supports regardless of actual granule data
  DEFAULT_GRANULES_PER_ORDER = 2000       # The maximum size of an individual order

  # Retrieves and sets the granule_count column on the record based on the granule params
  #
  # @return [Echo::Client] an instance of Echo::Client to communicate with CMR and ECHO Rest
  def client
    @client ||= Echo::Client.client_for_environment(retrieval.environment, Rails.configuration.services)
  end

  # Retrieves and sets the collection_metadata column on the record based on the collection id
  def set_collection_metadata
    collection_metadata_params = {
      echo_collection_id: collection_id,
      include_tags: "#{Rails.configuration.cmr_tag_namespace}.*"
    }

    response = client.get_collections(collection_metadata_params, retrieval.token)

    self.collection_metadata = if response.success?
                                 collections = response.body.fetch('feed', {})['entry']

                                 collections.first if collections.present?
                               else
                                 logger.error "[ERROR] Failed to get collection #{collection_id} from CMR: #{response.errors.join('\n')}"

                                 {}
                               end

    save
  end

  # Retrieves and sets the granule_count column on the record based on the granule params
  def set_granule_count
    granule_result = client.get_granules(granule_params, retrieval.token)

    self.granule_count = if granule_result.success?
                           granule_result.headers['cmr-hits'].to_i || 0
                         else
                           logger.error "Failed to get granules from CMR with params: #{granule_params}\n\n#{granule_result.errors.join('\n')}"

                           0
                         end

    save
  end

  # Returns the number of granules requested by the user, with a maximum value set.
  #
  # @return [Fixnum] the number of granules requested by the user or DEFAULT_MAX_ORDER_SIZE, whichever is smaller
  def adjusted_granule_count
    [DEFAULT_MAX_ORDER_SIZE, granule_count].min
  end

  # Returns the tags assinged to this records collection.
  #
  # @return [Hash] a hash of cmr tags assigned to the collection associated with this record
  def tags
    collection_metadata.fetch('tags', {})
  end

  # Determine whether or not the colleciton associated with this record has limitations on its granule ordering.
  #
  # @return [Boolean] is_limited_collectiontrue if colleciton is limited, otherwise false.
  def limited_collection?
    tags.key?('edsc.limited_collections')
  end

  # Determine the maximum size value for an order sent from EDSC.
  #
  # @return [Fixnum] the defined limited order size if provided or DEFAULT_GRANULES_PER_ORDER by default
  def max_order_size
    if limited_collection?
      tags.fetch('edsc.limited_collections', {}).fetch('data', {}).fetch('limit', DEFAULT_GRANULES_PER_ORDER).to_i
    else
      DEFAULT_GRANULES_PER_ORDER
    end
  end

  # Construct a hash in the expected format for the ECHO Rest contact information endpoint.
  #
  # @return [Hash] an object used as payload to the contact information endpoint
  def order_user_information
    contact = retrieval.construct_order_contact

    {
      user_information: {
        shipping_contact: contact,
        billing_contact: contact,
        order_contact: contact,
        user_domain: retrieval.user.echo_profile.fetch('user', {})['user_domain'],
        user_region: retrieval.user.echo_profile.fetch('user', {})['user_region']
      }
    }
  end
end
