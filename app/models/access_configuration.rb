class AccessConfiguration < ActiveRecord::Base
  belongs_to :user
  store :service_options, coder: JSON
end
