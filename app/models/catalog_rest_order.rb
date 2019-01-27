# This order type requires a single HTTP request to https://api.echo.nasa.gov/catalog-rest
class CatalogRestOrder < Order
  include AASM

  aasm column: 'state' do
    state :initialized, initial: true

    # Submit the order
    state :submitted

    event :submit do
      transitions from: [:initialized], to: :submitted
    end
  end

  def order_type
    'service'
  end

  def order_status
    order_information.fetch('requestStatus', {}).fetch('status', 'creating').downcase
  end

  def granules_requested
    order_information.fetch('requestStatus', {}).fetch('totalNumber', 0).to_i
  end

  def granules_processed
    order_information.fetch('requestStatus', {}).fetch('numberProcessed', 0).to_i
  end
end
