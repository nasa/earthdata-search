class Health
  # things to check: delayed_job, background crons, database, ECHO, CMR, URS, Opensearch, browse-scaler

  def initialize
    @ok = true
  end

  def edsc_status
    {ok?: @ok}
  end

  def delayed_job_status
    job = DelayedJob.last
    retrieval = Retrieval.last
    if job.run_at > retrieval.created_at
      {ok?: true}
    else
      @ok = false
      {ok?: false, error: "Last job ran at #{job.run_at} which is behind order retrieval creation time of #{retrieval.created_at}"}
    end
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
    Dir.glob(Rails.root.join('tmp', "#{job}_*")).each do |f|
      last_run_time = Time.at(f.match(/[a-zA-Z_]+_(\d+)/)[1].to_i)
      if last_run_time.nil? || last_run_time < Time.now - interval * 3
        @ok = false
        return {ok?: false, error: "Cron job '#{job.split('_').join(':')}' hasn't been run since #{last_run_time}."}
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
