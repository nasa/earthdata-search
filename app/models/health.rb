class Health
  # things to check: delayed_job, background crons, database, ECHO, CMR, URS, EDSC landing page, EDSC search page
  class << self
    def delayed_job_status
      job = DelayedJob.last
      retrieval = Retrieval.last
      if job.run_at > retrieval.created_at
        {ok?: true}
      else
        {ok?: false, error: "Last job ran at #{job.run_at} which is behind order retrieval creation time of #{retrieval.created_at}"}
      end
    end

    def data_load_status
      check_cron_job('data_load', 1.hour)
    end

    def colormap_load_status
      check_cron_job('colormap_load', 1.day)
    end

    private

    def check_cron_job(job, interval)
      Dir.glob(Rails.root.join('tmp', "#{job}_*")).each do |f|
        last_run_time = Time.at(f.match(/[a-zA-Z_]+_(\d+)/).last)
        if last_run_time.nil? || last_run_time < Time.now - interval * 3
          return {ok?: false, error: "Cron job '#{job.split('_').join(':')}' hasn't been run since #{last_run_time}."}
        else
          return {ok?: true}
        end
      end
    end
  end
end
