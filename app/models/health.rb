class Health
  # things to check: delayed_job, background crons, database, ECHO, CMR, URS, Opensearch, browse-scaler

  def initialize
    @ok = true
  end

  def edsc_status
    {ok?: @ok}
  end

  def delayed_job_status
    # check if there are any jobs that hadn't been run after 10 minutes passed.
    queued_jobs = DelayedJob.where('created_at < ? AND run_at IS NULL', 10.minutes.ago)
    if queued_jobs.size > 0
      @ok = false
      return {ok?: false, error: "Last job (job id: #{job.id}) failed to start 10 minutes after retrieval is created."}
    end

    # Further check failed_at and last_error
    failed_jobs = DelayedJob.where('last_error IS NOT NULL AND created_at > ?', 1.hour.ago)
    if failed_jobs.size > 0
      total_jobs = DelayedJob.where('created_at > ?', 1.hour.ago)
      @ok = false
      return {ok?: false, error: "There are #{failed_jobs.size} out of #{total_jobs.size} failed jobs in the past hour."}
    end

    {ok?: true}
  end

  def data_load_status
    check_cron_job('data_load', 1.hour)
  end

  def colormap_load_status
    check_cron_job('colormaps_load', 1.day)
  end

  def echo_status(echo_client)
    # check ECHO-REST availability
    res = echo_client.get_echo_availability
    ok? res, res.body['availability'].downcase == 'available'
  end

  def cmr_status(echo_client)
    # copied from eed_utility_scripts
    res = echo_client.get_cmr_availability
    json = res.body.to_json
    ok? res, json.include?("\"ok?\":true") && !json.include?("false")
  end

  def opensearch_status(echo_client)
    # check home page only
    res = echo_client.get_opensearch_availability
    ok? res
  end

  def browse_scaler_status(echo_client)
    # a 500 error will be returned if either hdf2jpeg or image_magick is DOWN
    ok? echo_client.get_browse_scaler_availability
  end

  def urs_status(echo_client)
    # check login page
    ok? echo_client.get_urs_availability
  end

  private

  def check_cron_job(job, interval)
    # After deployment, the tmp folder will contain nothing and data:load won't be run until 1 hour passed.
    # To stop sending false negative to ops, we need to check the created time of the tmp folder to 'detect' a new
    # deployment. And give it 3 * 1hour grace period before reporting @ok = false.
    #
    # i.e. Report cron_jobs healthy for 3 hours after a new deployment.
    if File.ctime(Rails.root.join('README.md')) > 3.hours.ago
      return {ok?: true, info: "Suspend cron job checks for 3 hours after new deployment."}
    end

    Dir.glob(Rails.root.join('tmp', "#{job}_*")).each do |f|
      if File.mtime(f) < Time.now - interval * 3
        @ok = false
        return {ok?: false, error: "Cron job '#{job.split('_').join(':')}' hasn't been run since #{File.mtime(f)}."}
      elsif f.match /_failed$/
        @ok = false
        return {ok?: false, error: "Cron job '#{job.split('_').join(':')}' failed in last run at #{File.mtime(f)} with message '#{File.read(f)}'."}
      else
        return {ok?: true}
      end
    end
    @ok = false
    {ok?: false, error: "Cron job '#{job.split('_').join(':')}' has never been run."}
  end

  def ok?(response, condition=nil)
    if response.success?
      if condition.nil?
        {ok?: true}
      else
        condition ? {ok?: true} : (@ok = false; {ok?: false, error: response.body.to_json})
      end
    else
      @ok = false
      {ok?: false, error: "Response code is #{response.status}"}
    end
  end
end
