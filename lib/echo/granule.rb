module Echo
  class Granule
    attr_accessor :browse_urls, :id
    attr_accessor :granule_ur, :insert_time, :last_update, :dataset_id, :size_mb
    attr_accessor :day_night_flag, :production_date, :temporal, :spatial
    attr_accessor :orbit_calculated_spatial_domains, :measured_parameters, :platforms, :campaigns
    attr_accessor :additional_attributes, :input_granules, :price, :online_access_urls
    attr_accessor :online_resources, :orderable, :data_format, :visible
    attr_accessor :native_url, :atom_url, :echo10_url, :iso19115_url
    attr_accessor :xml
  end
end
