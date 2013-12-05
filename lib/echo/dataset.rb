module Echo
  class Dataset
    attr_accessor :id, :dataset_id, :summary, :updated, :short_name, :version_id, :data_center
    attr_accessor :archive_center, :processing_level_id, :time_start, :time_end, :links, :boxes, :points, :dif_ids
    attr_accessor :online_access_flag, :browse_flag
  end
end
