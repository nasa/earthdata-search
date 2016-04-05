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
    check_cron_job('data:load', 1.hour)
  end

  def colormap_load_status
    check_cron_job('colormaps:load', 1.day)
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

  def check_cron_job(task_name, interval)
    tasks = CronJobHistory.where(task_name: task_name).where(last_run: (Time.now - 3 * interval)..Time.now)

    if tasks.size == 0
      @ok = false
      return {ok?: false, error: "Cron job '#{task_name}' hasn't been run in the past #{3 * interval} seconds."}
    end

    if Rails.env.production?
      # There are two hosts in production. We need to make sure the rake tasks are run on both of them.
      task1 = tasks.last
      status1 = task_status(interval, task1, task_name)
      task2 = tasks.select {|task| task.host != task1.host}.last
      if task2.nil?
        @ok = false
        {ok?: false, error: "Cron job '#{task_name}' hasn't been run in the past #{3 * interval} seconds on the other production host (other than #{task1.host}). #{status1[:error]}"}
      else
        status2 = task_status(interval, task2, task_name)
        if status2[:ok?] && status1[:ok?]
          {ok?: true}
        else
          @ok = false
          {ok?: false, error: "#{status1[:error]} #{status2[:error]}"}
        end
      end
    else
      task = tasks.last
      task_status(interval, task, task_name)
    end
  end

  def task_status(interval, task, task_name)
    if task.status == 'succeeded'
      if task.last_run < Time.now - interval && task.last_run > Time.now - 3 * interval
        return {ok?: true, info: "Suspend cron job checks for #{interval.to_i / 3600} hours after a new deployment. Last task execution was #{task.status} at #{task.last_run} on host #{task.host}."}
      elsif task.last_run < Time.now - 3 * interval
        @ok = false
        return {ok?: false, error: "Cron job '#{task_name}' hasn't been run since #{task.last_run} on host #{task.host}."}
      else
        return {ok?: true}
      end
    else
      @ok = false
      {ok?: false, error: "Cron job '#{task_name}' failed in last run at #{task.last_run} with message '#{task.message}' on host #{task.host}."}
    end
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
