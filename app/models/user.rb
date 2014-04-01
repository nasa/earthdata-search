class User < ActiveRecord::Base
  validates :echo_id, presence: true, uniqueness: true

  store :site_preferences, coder: JSON
end
