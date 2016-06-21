class User < ActiveRecord::Base
  validates :echo_id, presence: true, uniqueness: true
  has_many :recent_collections
  has_many :retrievals, -> { order('created_at desc') }

  store :site_preferences, coder: JSON
end
