class EarthdataServiceConfig
  ECHO_OPS_ROOT = "https://api.echo.nasa.gov"
  ECHO_WORKLOAD_ROOT = "http://wlapp4.dev.echo.nasa.gov:42000" # Requires VPN, no URS support
  ECHO_PARTNERTEST_ROOT = "https://api-test.echo.nasa.gov"
  ECHO_TESTBED_ROOT = "https://testbed.echo.nasa.gov"

  CMR_OPS_ROOT = "https://cmr.earthdata.nasa.gov" # Does not exist yet
  CMR_WORKLOAD_ROOT = "http://cmr-wl-app1.dev.echo.nasa.gov:3003" # Runs on cmr-wl-app1, cmr-wl-app2, cmr-wl-app3.  Requires VPN
  CMR_UAT_ROOT = "https://cmr.uat.earthdata.nasa.gov" # Does not exist yet
  CMR_SIT_ROOT = "https://cmr.sit.earthdata.nasa.gov"

  URS_OPS_ROOT = "https://urs.earthdata.nasa.gov"
  URS_UAT_ROOT = "https://uat.urs.earthdata.nasa.gov"
  URS_SIT_ROOT = "https://sit.urs.earthdata.nasa.gov"

  def self.config_for(cmr_environment)
    if cmr_environment == 'prod'
      urs_root = URS_OPS_ROOT
      echo_root = ECHO_OPS_ROOT
      cmr_root = CMR_OPS_ROOT
    elsif cmr_environment == 'workload'
      urs_root = URS_OPS_ROOT # Note: Does not work.  Workload mocks URS.
      echo_root = ECHO_WORKLOAD_ROOT
      cmr_root = CMR_WORKLOAD_ROOT
    elsif cmr_environment == 'uat'
      urs_root = URS_UAT_ROOT
      echo_root = ECHO_PARTNERTEST_ROOT
      cmr_root = CMR_UAT_ROOT
    elsif cmr_environment == 'sit'
      urs_root = URS_SIT_ROOT
      echo_root = ECHO_TESTBED_ROOT
      cmr_root = CMR_SIT_ROOT
    else
      raise "Unrecognized ECHO environment: #{cmr_environment}"
    end
    EarthdataServiceConfig.new(urs_root, echo_root, cmr_root)
  end

  attr_reader :urs_root
  attr_reader :echo_root
  attr_reader :cmr_root

  def initialize(urs_root, echo_root, cmr_root)
    @urs_root = urs_root
    @echo_root = echo_root
    @cmr_root = cmr_root
  end
end
