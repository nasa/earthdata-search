class Order < ActiveRecord::Base
  belongs_to :retrieval_collection
  belongs_to :orderable, polymorphic: true

  store :search_params,      coder: JSON
  store :order_information,  coder: JSON

  validates :order_number, uniqueness: { scope: :retrieval_collection_id }

  def logging_tag
    "#{retrieval_collection.logging_tag} -- Order [#{id}##{order_number}]"
  end

  def order_type
    throw 'No Order Type method defined for order.'
  end

  def order_status
    throw 'No Order Status method defined for order'
  end

  def granules_requested
    0
  end

  def granules_processed
    0
  end
end
