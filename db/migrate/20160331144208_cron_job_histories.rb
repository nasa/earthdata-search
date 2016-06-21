class CronJobHistories < ActiveRecord::Migration
  def change
    create_table :cron_job_histories do |t|
      t.string :task_name
      t.datetime :last_run
      t.string :status
      t.text :message
      t.string :host
    end

    add_index :cron_job_histories, [:task_name, :last_run]
  end
end
