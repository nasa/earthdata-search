# This order type requires 4 HTTP requests to https://cmr.earthdata.nasa.gov/legacy-services/rest
#
# 1. Create an empty order
# 2. Add the items the user wishes to order
# 3. Provide user contact information
# 4. Submit the order
class LegacyServicesOrder < Order
  include AASM

  aasm column: 'state' do
    state :initialized, initial: true

    # Create an empty order
    state :created

    # Supply the granules the user has asked for
    state :items_added

    # Provide contact information for the user
    state :contact_information_provided

    # Submit the order
    state :submitted

    # Events
    event :create_empty_order do
      transitions from: [:initialized], to: :created
    end

    event :add_items do
      transitions from: [:created], to: :items_added
    end

    event :add_contact_information do
      transitions from: [:items_added], to: :contact_information_provided
    end

    event :submit do
      transitions from: [:contact_information_provided], to: :submitted
    end
  end

  def order_type
    'order'
  end

  def order_status
    order_information.fetch('state', '').downcase
  end
end
