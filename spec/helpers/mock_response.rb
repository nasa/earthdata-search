class MockResponse
  attr_accessor :body, :headers, :status

  def self.atom(body=[], headers={}, status=200)
    headers['echo-hits'] ||= body.size.to_s
    headers['echo-hits-estimated'] ||= false
    headers['echo-cursor-at-end'] ||= true
    body = {'feed' => {'entry' => body}}
    MockResponse.new(body, headers, status)
  end

  def self.edsc_dependency(body)
    MockResponse.new(body, {}, 200)
  end

  def self.user_profile_response(body)
    MockResponse.new(body, {}, 200)
  end

  def initialize(body="", headers={}, status=200)
    @body = body
    @headers = headers
    @status = status
  end

  def success?
    @status < 400
  end
end
