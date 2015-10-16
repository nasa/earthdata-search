class AddIndexesToDelayedJobs < ActiveRecord::Migration
  def change
    add_index :delayed_jobs, :created_at
    add_index :delayed_jobs, :failed_at
  end
end
