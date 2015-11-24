module Echo
  class Collection
    attr_accessor :id, :dataset_id, :summary, :updated, :short_name, :version_id, :data_center
    attr_accessor :archive_center, :processing_level_id, :time_start, :time_end, :links
    attr_accessor :boxes, :points, :lines, :polygons, :dif_ids
    attr_accessor :online_access_flag, :browse_flag, :geometry
    attr_accessor :description, :processing_center, :orderable, :visible, :temporal
    attr_accessor :contacts, :science_keywords, :online_access_urls, :online_resources
    attr_accessor :associated_difs, :spatial, :browse_images
    attr_accessor :native_url, :atom_url, :echo10_url, :iso19115_url, :smap_iso_url, :dif_url, :osdd_url
    attr_accessor :extra_attrs, :xml, :granule_url
  end
end
