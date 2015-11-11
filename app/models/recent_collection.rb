class RecentCollection < ActiveRecord::Base
  self.table_name = "recent_datasets"

  belongs_to :user

  default_scope { order('updated_at DESC') }
end
