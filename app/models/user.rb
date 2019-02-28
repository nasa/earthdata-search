class User < ActiveRecord::Base
  validates :echo_id, presence: true, uniqueness: true

  has_many :retrievals, -> { order('created_at desc') }
  has_many :shapefiles

  store :site_preferences, coder: JSON
  store :urs_profile,      coder: JSON
  store :echo_profile,     coder: JSON
  store :echo_preferences, coder: JSON
end
