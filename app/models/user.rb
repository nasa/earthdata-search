class User < ActiveRecord::Base
  validates :echo_id, presence: true, uniqueness: true
  has_many :recent_datasets

  store :site_preferences, coder: JSON
end
