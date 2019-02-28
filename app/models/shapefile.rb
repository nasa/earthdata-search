class Shapefile < ActiveRecord::Base
  belongs_to :user, required: false

  store :file, coder: JSON

  obfuscate_id spin: 75932045

  validates :file, presence: true
  validates :file_hash, presence: true, uniqueness: true

  # Insert the shapefile id (obfuscated) into the shapefile, for KO to
  # add to the URL
  def file_with_id
    file['shapefile_id'] = to_param
    file
  end

  def self.generate_hash(file)
    Digest::MD5.hexdigest(file.to_s)
  end
end
