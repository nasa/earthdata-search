class ReAddIndexesToDelayedJobs < ActiveRecord::Migration
  def change
    begin
      add_index :delayed_jobs, :created_at
      add_index :delayed_jobs, :failed_at
    rescue ArgumentError => e
      # Ignore if index already exists. index_exists? doesn't seem to work on sqlite3
    end
  end
end
