require 'securerandom'

class Retrieval < ActiveRecord::Base
  include ActionView::Helpers::TextHelper

  belongs_to :user

  has_many :retrieval_collections, dependent: :destroy

  store :jsondata, coder: JSON

  obfuscate_id spin: 53465485

  after_save :update_access_configurations
  after_create :log_obfuscation_info

  # '' could be the status if we start checking order status before the order has been created. In that case we want to
  # assume the status is 'in progress'
  IN_PROGRESS_STATUS_LIST = ['', 'cancelling', 'creating', 'in progress', 'not_validated', 'pending', 'processing', 'processing_with_exceptions', 'quoted', 'quoted_with_exceptions', 'quoting', 'submitted_with_exceptions', 'submitting', 'validated'].freeze

  def log_obfuscation_info
    Rails.logger.info "Retrieval Object with obfuscated ID of #{to_param} has ID #{id}."
  end

  def portal
    return @portal if @portal

    if jsondata && jsondata['query']
      query = Rack::Utils.parse_nested_query(jsondata['query'])

      @portal = query['portal'] if Rails.configuration.portals.key?(query['portal'])
    end

    @portal
  end

  def portal_title
    return nil if portal.blank?

    config = Rails.configuration.portals[portal] || {}

    "#{config['title'] || portal.titleize} Portal"
  end

  def path
    prefix = portal ? "/portal/#{portal}" : ''
    "#{prefix}/data/retrieve/#{to_param}"
  end

  def description
    @description ||= jsondata['description']
    unless @description
      collection = collections.first
      @description = get_collection_id(collection['id']) if collection

      if @description
        if collections.size > 1
          @description += " and #{pluralize(collections.size - 1, 'other collection')}"
        end
      else
        @description = pluralize(collections.size, 'collection')
      end
      jsondata['description'] = @description
      save!
    end
    @description
  end

  def collections
    Array.wrap(jsondata['collections'] || jsondata['datasets'])
  end

  def source
    jsondata['source']
  end

  def project
    jsondata.except('datasets').merge(collections: collections)
  end

  def project=(project_json)
    datasets = Array.wrap(project_json['collections'] || project_json['datasets'])
    self.jsondata = project_json.except('collections').merge(datasets: datasets)
  end

  # Using stored user data construct a contact object expected by echo when placing an order
  #
  # @return [Hash] object representing the user provided formatted for echo orders
  def construct_order_contact
    edsc_user = User.find_by(echo_id: user.echo_id)

    # TODO: Take into account address and phone values stored for the user
    # TODO: Try to use appropriate array syntax for phones
    {
      email: edsc_user.urs_profile['email_address'],
      first_name: edsc_user.urs_profile['first_name'],
      last_name: edsc_user.urs_profile['last_name'],
      organization: edsc_user.urs_profile['organization'],
      address: {
        country: edsc_user.urs_profile['country']
      },
      phones: {
        '0': {
          number: '0000000000', phone_number_type: 'BUSINESS'
        }
      },
      role: 'Order Contact'
    }
  end

  # Returns whether or not the retrieval is still processing any of it's orders
  def in_progress
    orders = Order.joins(retrieval_collection: :retrieval).where(retrievals: { id: id })

    orders.any? && (orders.map(&:order_status) & IN_PROGRESS_STATUS_LIST).any?
  end

  def logging_tag
    "Retreival [#{id}##{to_param}]"
  end

  private

  def get_collection_id(id)
    result = nil
    client = Echo::Client.client_for_environment(@cmr_env || 'prod', Rails.configuration.services)
    response = client.get_collections(echo_collection_id: [id])
    if response.success?
      entry = response.body['feed']['entry'].first
      result = entry['title'] if entry
    end
    result
  end

  def update_access_configurations
    collections.each do |collection|
      if collection.key?('serviceOptions') && collection.key?('id')
        AccessConfiguration.set_default_access_config(user, collection['id'], collection['serviceOptions'], collection['form_hashes'])
      end
    end
  end
end
