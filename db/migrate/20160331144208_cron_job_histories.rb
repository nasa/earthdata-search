class CronJobHistories < ActiveRecord::Migration
  def change
    create_table :cron_job_histories do |t|
      t.string :task_name
      t.datetime :last_run
      t.string :status
      t.text :message
    end
  end
end
