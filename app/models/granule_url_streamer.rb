class GranuleUrlStreamer
  def initialize(params, token, url_mapper, echo_client, url_type=:download)
    params.reject!{|p| ['datasource', 'short_name'].include? p}
    @params = params
    @token = token
    @url_mapper = url_mapper
    @echo_client = echo_client
    @url_type = url_type
  end
end